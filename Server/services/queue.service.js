const Queue = require("../models/queueSchema");
const Service = require("../models/serviceSchema");
const User = require("../models/userSchema");
const QueueNumberManager = require("../helpers/queueHelpers/queueNumberManager");
const QueueValidator = require("../helpers/queueHelpers/queueValidator");
const { getTodayMidnight } = require("../utils/dateHelper");

class QueueService {
  /**
   * Join a queue for a specific service
   */
  async joinQueue(patientId, serviceId) {
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      throw { status: 404, message: "Service not found" };
    }

    // Validate patient doesn't have active queue
    const existingQueue = await QueueValidator.checkExistingQueue(
      patientId,
      sessionStart,
      nextSessionStart,
    );
    if (existingQueue) {
      throw {
        status: 400,
        message: `You already have a queue today for ${existingQueue.service.name}`,
        queueCode: existingQueue.queueCode,
      };
    }

    // Validate queue limit (use total count, not active count)
    const totalCount = await this.getTotalQueueCount(
      serviceId,
      sessionStart,
      nextSessionStart,
    );
    if (service.queueLimit !== null && totalCount >= service.queueLimit) {
      throw { status: 400, message: "Queue is full for today" };
    }

    // Generate queue number and code
    const queueNumber = await QueueNumberManager.getNextQueueNumber(
      serviceId,
      sessionStart,
      nextSessionStart,
    );
    const queueCode = QueueNumberManager.generateQueueCode(
      service.identifier,
      queueNumber,
    );

    // Create queue entry
    const queueEntry = await Queue.create({
      service: serviceId,
      serviceIdentifier: service.identifier,
      queueNumber,
      queueCode,
      patient: patientId,
      date: sessionStart,
      status: "waiting",
    });

    const patient = await User.findById(patientId);

    return {
      queueEntry,
      patient,
      service,
      queueCode,
      queueNumber,
      today: sessionStart,
    };
  }

  /**
   * Get queue information for a specific service
   */
  async getServiceQueue(serviceId) {
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const service = await Service.findById(serviceId);
    if (!service) {
      throw { status: 404, message: "Service not found" };
    }

    // Get active queues for display (only waiting/serving)
    const queue = await Queue.find({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving"] },
    })
      .populate("patient", "firstName lastName")
      .sort({ queueNumber: 1 });

    // Get total slots issued (including skipped) for limit check
    const totalSlotsIssued = await this.getTotalQueueCount(
      serviceId,
      sessionStart,
      nextSessionStart,
    );

    const nextNumber = await QueueNumberManager.getNextQueueNumber(
      serviceId,
      sessionStart,
      nextSessionStart,
    );

    return {
      queue,
      nextNumber:
        service.queueLimit !== null && totalSlotsIssued >= service.queueLimit
          ? null
          : nextNumber,
      limit: service.queueLimit,
      identifier: service.identifier,
    };
  }

  /**
   * Get user's active queue
   */
  async getUserQueue(patientId) {
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const userQueue = await Queue.findOne({
      patient: patientId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving", "skipped"] },
    }).populate("service", "name identifier queueLimit");

    if (!userQueue) {
      return { hasQueue: false };
    }

    const activeCount = await this.getActiveQueueCount(
      userQueue.service._id,
      sessionStart,
      nextSessionStart,
    );

    return {
      hasQueue: true,
      queue: {
        _id: userQueue._id,
        queueCode: userQueue.queueCode,
        queueNumber: userQueue.queueNumber,
        serviceName: userQueue.service.name,
        serviceId: userQueue.service._id,
        status: userQueue.status,
        isLimitReached: activeCount >= userQueue.service.queueLimit,
        queueLimit: userQueue.service.queueLimit,
        currentCount: activeCount,
      },
    };
  }

  /**
   * Cancel user's queue
   */
  async cancelQueue(patientId) {
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const userQueue = await Queue.findOne({
      patient: patientId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving", "skipped"] },
    }).populate("service", "identifier name");

    if (!userQueue) {
      throw { status: 404, message: "No active queue found" };
    }

    const canceledQueueNumber = userQueue.queueNumber;
    const serviceId = userQueue.service._id;
    const serviceIdentifier = userQueue.service.identifier;
    const queueCode = userQueue.queueCode;

    // Mark as cancelled
    await Queue.updateOne({ _id: userQueue._id }, { status: "cancelled" });

    // Reorder higher queues
    const reorderedCount =
      await QueueNumberManager.reorderQueuesAfterCancellation(
        serviceId,
        sessionStart,
        nextSessionStart,
        canceledQueueNumber,
        serviceIdentifier,
      );

    const patient = await User.findById(patientId);

    return {
      patient,
      service: userQueue.service,
      queueCode,
      queueId: userQueue._id,
      canceledQueueNumber,
      reorderedCount,
      serviceId,
    };
  }

  /**
   * Call next person in queue
   * Priority order: Senior Citizens > PWD > Regular (by queue number)
   * Also includes skipped patients that can be recalled
   */
  async callNextInQueue(serviceId) {
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const service = await Service.findById(serviceId);
    if (!service) {
      throw { status: 404, message: "Service not found" };
    }

    // Check if there's already someone being served
    const currentlyServing = await Queue.findOne({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: "serving",
    }).sort({ queueNumber: 1 });

    // If someone is already being served, recall them
    if (currentlyServing) {
      return {
        service,
        queueCode: currentlyServing.queueCode,
        queueNumber: currentlyServing.queueNumber,
        isRecall: true,
      };
    }

    // Get all waiting queues with patient priority status
    const waitingQueues = await Queue.find({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: "waiting",
    })
      .populate("patient", "priorityStatus")
      .sort({ queueNumber: 1 });

    if (!waitingQueues || waitingQueues.length === 0) {
      throw { status: 404, message: "No one in queue" };
    }

    // Priority-based selection
    // 1. First check for Senior Citizens
    let nextQueue = waitingQueues.find(
      (q) => q.patient?.priorityStatus === "Senior Citizen",
    );

    // 2. If no Senior Citizen, check for PWD
    if (!nextQueue) {
      nextQueue = waitingQueues.find(
        (q) => q.patient?.priorityStatus === "PWD",
      );
    }

    // 3. If no priority patients, get the first regular patient
    if (!nextQueue) {
      nextQueue = waitingQueues[0];
    }

    // Update to serving and record start time
    await Queue.updateOne(
      { _id: nextQueue._id },
      { status: "serving", servingStartedAt: new Date() },
    );

    return {
      service,
      queueCode: nextQueue.queueCode,
      queueNumber: nextQueue.queueNumber,
      isRecall: false,
      priorityStatus: nextQueue.patient?.priorityStatus || "None",
    };
  }

  /**
   * Recall a skipped patient from the recall list
   */
  async recallSkippedPatient(queueId) {
    const queue = await Queue.findById(queueId)
      .populate("service", "identifier name")
      .populate("patient", "firstName lastName priorityStatus");

    if (!queue) {
      throw { status: 404, message: "Queue not found" };
    }

    if (queue.status !== "skipped") {
      throw { status: 400, message: "Can only recall skipped patients" };
    }

    // Check if someone is already being served
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const currentlyServing = await Queue.findOne({
      service: queue.service._id,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: "serving",
    });

    if (currentlyServing) {
      throw {
        status: 400,
        message: "Cannot recall while another patient is being served",
      };
    }

    // Update to serving and record start time if not already set
    const updateData = { status: "serving" };
    if (!queue.servingStartedAt) {
      updateData.servingStartedAt = new Date();
    }
    await Queue.updateOne({ _id: queueId }, updateData);

    return {
      service: queue.service,
      queueCode: queue.queueCode,
      queueNumber: queue.queueNumber,
      isRecall: true,
      priorityStatus: queue.patient?.priorityStatus || "None",
    };
  }

  /**
   * Remove a patient from the recall list (mark as cancelled)
   */
  async removeFromRecallList(queueId, adminId) {
    const queue = await Queue.findById(queueId)
      .populate("service", "identifier name")
      .populate("patient", "firstName lastName");

    if (!queue) {
      throw { status: 404, message: "Queue not found" };
    }

    if (queue.status !== "skipped") {
      throw { status: 400, message: "Can only remove skipped patients" };
    }

    const queueCode = queue.queueCode;
    const removedQueueNumber = queue.queueNumber;

    // Mark as cancelled
    await Queue.updateOne({ _id: queueId }, { status: "cancelled" });

    return {
      queue,
      queueCode,
      removedQueueNumber,
      adminId,
    };
  }

  /**
   * Mark queue as served/completed
   */
  async markAsServed(queueId, adminId) {
    const queue = await Queue.findById(queueId)
      .populate("service", "identifier name")
      .populate("patient", "firstName lastName");

    if (!queue) {
      throw { status: 404, message: "Queue not found" };
    }

    const queueCode = queue.queueCode;
    const servedQueueNumber = queue.queueNumber;

    // Mark as completed and record completion time
    await Queue.updateOne(
      { _id: queueId },
      { status: "completed", servedAt: new Date() },
    );

    return {
      queue,
      queueCode,
      servedQueueNumber,
      adminId,
    };
  }

  /**
   * Skip a patient who is not responding
   */
  async skipQueue(queueId, adminId) {
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const queue = await Queue.findById(queueId)
      .populate("service", "identifier name")
      .populate("patient", "firstName lastName");

    if (!queue) {
      throw { status: 404, message: "Queue not found" };
    }

    if (queue.status !== "serving") {
      throw { status: 400, message: "Can only skip currently serving patient" };
    }

    const queueCode = queue.queueCode;
    const skippedQueueNumber = queue.queueNumber;

    // Mark as skipped
    await Queue.updateOne({ _id: queueId }, { status: "skipped" });

    return {
      queue,
      queueCode,
      skippedQueueNumber,
      adminId,
    };
  }

  /**
   * Get all active queues across all services
   */
  async getAllActiveQueues() {
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const services = await Service.find().populate(
      "monitoredBy",
      "firstName lastName",
    );

    const servicesWithQueues = await Promise.all(
      services.map(async (service) => {
        const queues = await Queue.find({
          service: service._id,
          date: { $gte: sessionStart, $lt: nextSessionStart },
          status: { $in: ["waiting", "serving"] },
        })
          .populate("patient", "firstName lastName")
          .sort({ queueNumber: 1 });

        const waitingCount = queues.length;
        const nextQueueNumber = waitingCount > 0 ? queues[0].queueNumber : null;
        const lastQueueNumber =
          waitingCount > 0 ? queues[queues.length - 1].queueNumber : null;

        return {
          _id: service._id,
          name: service.name,
          identifier: service.identifier,
          description: service.description,
          queueLimit: service.queueLimit,
          status: service.status,
          waitingCount,
          nextQueueNumber,
          lastQueueNumber,
          monitoredBy: service.monitoredBy
            ? `${service.monitoredBy.firstName} ${service.monitoredBy.lastName}`
            : null,
          isMonitored: !!service.monitoredBy,
          queues: queues.map((q) => ({
            _id: q._id,
            queueCode: q.queueCode,
            queueNumber: q.queueNumber,
            patientName: q.patient
              ? `${q.patient.firstName} ${q.patient.lastName}`
              : "Unknown",
            status: q.status,
          })),
        };
      }),
    );

    return servicesWithQueues;
  }

  /**
   * Helper: Get active queue count for a service
   */
  async getActiveQueueCount(serviceId, sessionStart, nextSessionStart) {
    return await Queue.countDocuments({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving"] },
    });
  }

  /**
   * Helper: Get total queue count for a service (excludes cancelled)
   * Cancellations free up the slot, completed consultations don't
   */
  async getTotalQueueCount(serviceId, sessionStart, nextSessionStart) {
    return await Queue.countDocuments({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $ne: "cancelled" }, // Exclude cancelled queues
    });
  }
}

module.exports = new QueueService();
