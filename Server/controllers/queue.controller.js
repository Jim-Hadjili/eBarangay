const QueueService = require("../services/queue.service");
const ActivityLogger = require("../utils/activityLogger");
const {
  notifyNextInQueue,
  notifyPatientSkipped,
  notifyWaitingTimeUpdate,
} = require("../utils/socketNotifications");
const { emitDashboardUpdate } = require("./dashboard.controller");
const QueueResponseFormatter = require("../helpers/queueHelpers/queueResponseFormatter");

/**
 * Join a queue for a specific service
 */
exports.joinQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const patientId = req.user.id;

    const result = await QueueService.joinQueue(patientId, serviceId);

    // Log activity
    await ActivityLogger.log({
      activityType: "queue_joined",
      description: `${result.patient.firstName} ${result.patient.lastName} joined ${result.service.name} queue`,
      performedBy: patientId,
      service: serviceId,
      queue: result.queueEntry._id,
      metadata: {
        queueCode: result.queueCode,
        queueNumber: result.queueNumber,
      },
    });

    // Emit socket updates
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");

      // Emit waiting time update for this service
      notifyWaitingTimeUpdate(io, serviceId);
    }

    res
      .status(201)
      .json(
        QueueResponseFormatter.formatJoinQueueResponse(
          result.queueCode,
          result.queueNumber,
          result.service.name,
          result.today,
        ),
      );
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Server error",
      ...(err.queueCode && { queueCode: err.queueCode }),
    });
  }
};

/**
 * Get queue information for a specific service
 */
exports.getServiceQueue = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const result = await QueueService.getServiceQueue(serviceId);

    res.json(
      QueueResponseFormatter.formatServiceQueueResponse(
        result.queue,
        result.nextNumber,
        result.limit,
        result.identifier,
      ),
    );
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Get user's active queue
 */
exports.getUserQueue = async (req, res) => {
  try {
    const patientId = req.user.id;

    const result = await QueueService.getUserQueue(patientId);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Cancel user's queue
 */
exports.cancelQueue = async (req, res) => {
  try {
    const patientId = req.user.id;

    const result = await QueueService.cancelQueue(patientId);

    // Log activity
    await ActivityLogger.log({
      activityType: "queue_cancelled",
      description: `${result.patient.firstName} ${result.patient.lastName} cancelled queue ${result.queueCode} for ${result.service.name}`,
      performedBy: patientId,
      service: result.serviceId,
      metadata: {
        queueCode: result.queueCode,
        canceledQueueNumber: result.canceledQueueNumber,
      },
    });

    // Emit socket updates
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");

      // Emit queue history update to patient
      io.to(`queueHistory_${patientId}`).emit("queueHistoryUpdate", {
        _id: result.queueId,
        queueCode: result.queueCode,
        queueNumber: result.canceledQueueNumber,
        status: "cancelled",
        service: {
          _id: result.serviceId,
          name: result.service.name,
        },
        cancelledAt: new Date(),
      });
    }

    res.json(
      QueueResponseFormatter.formatCancelQueueResponse(result.reorderedCount),
    );
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Call next person in queue
 */
exports.callNextInQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const result = await QueueService.callNextInQueue(serviceId);

    // Send Socket.io notification
    const io = req.app.get("io");
    notifyNextInQueue(
      io,
      result.queueCode,
      result.queueNumber,
      result.service.name,
    );

    // Emit waiting time update for this service
    notifyWaitingTimeUpdate(io, result.service._id);

    res.json(
      QueueResponseFormatter.formatCallNextResponse(
        result.queueCode,
        result.queueNumber,
      ),
    );
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Recall a skipped patient
 */
exports.recallSkippedPatient = async (req, res) => {
  try {
    const { queueId } = req.params;

    const result = await QueueService.recallSkippedPatient(queueId);

    // Send Socket.io notification
    const io = req.app.get("io");
    notifyNextInQueue(
      io,
      result.queueCode,
      result.queueNumber,
      result.service.name,
    );

    res.json({
      message: "Patient recalled successfully",
      queue: {
        queueCode: result.queueCode,
        queueNumber: result.queueNumber,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Remove a patient from the recall list (permanently)
 */
exports.removeFromRecallList = async (req, res) => {
  try {
    const { queueId } = req.params;

    const result = await QueueService.removeFromRecallList(
      queueId,
      req.user.id,
    );

    // Log activity
    await ActivityLogger.log({
      activityType: "queue_removed",
      description: `Queue ${result.queueCode} removed from recall list for ${result.queue.patient.firstName} ${result.queue.patient.lastName} at ${result.queue.service.name}`,
      performedBy: result.adminId,
      targetUser: result.queue.patient._id,
      service: result.queue.service._id,
      metadata: {
        queueCode: result.queueCode,
        removedQueueNumber: result.removedQueueNumber,
      },
    });

    // Emit socket updates
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");

      // Emit queue history update to patient
      io.to(`queueHistory_${result.queue.patient._id}`).emit(
        "queueHistoryUpdate",
        {
          _id: result.queue._id,
          queueCode: result.queueCode,
          queueNumber: result.removedQueueNumber,
          status: "cancelled",
          service: {
            _id: result.queue.service._id,
            name: result.queue.service.name,
          },
          cancelledAt: new Date(),
        },
      );
    }

    res.json({
      message: "Patient removed from recall list successfully",
      queue: {
        queueCode: result.queueCode,
        queueNumber: result.removedQueueNumber,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Mark queue as served/completed
 */
exports.markAsServed = async (req, res) => {
  try {
    const { queueId } = req.params;

    const result = await QueueService.markAsServed(queueId, req.user.id);

    // Log activity
    await ActivityLogger.log({
      activityType: "queue_completed",
      description: `Queue ${result.queueCode} completed for ${result.queue.patient.firstName} ${result.queue.patient.lastName} at ${result.queue.service.name}`,
      performedBy: result.adminId,
      targetUser: result.queue.patient._id,
      service: result.queue.service._id,
      metadata: {
        queueCode: result.queueCode,
        servedQueueNumber: result.servedQueueNumber,
      },
    });

    // Emit socket updates
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");

      // Emit queue history update to patient
      io.to(`queueHistory_${result.queue.patient._id}`).emit(
        "queueHistoryUpdate",
        {
          _id: result.queue._id,
          queueCode: result.queueCode,
          queueNumber: result.servedQueueNumber,
          status: "completed",
          service: {
            _id: result.queue.service._id,
            name: result.queue.service.name,
          },
          completedAt: new Date(),
        },
      );

      // Emit waiting time update for this service (recalculate based on new consultation time)
      notifyWaitingTimeUpdate(io, result.queue.service._id);
    }

    res.json(
      QueueResponseFormatter.formatMarkAsServedResponse(
        result.queueCode,
        result.servedQueueNumber,
      ),
    );
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Skip a patient who is not responding
 */
exports.skipQueue = async (req, res) => {
  try {
    const { queueId } = req.params;

    const result = await QueueService.skipQueue(queueId, req.user.id);

    // Log activity
    await ActivityLogger.log({
      activityType: "queue_skipped",
      description: `Queue ${result.queueCode} skipped for ${result.queue.patient.firstName} ${result.queue.patient.lastName} at ${result.queue.service.name}`,
      performedBy: result.adminId,
      targetUser: result.queue.patient._id,
      service: result.queue.service._id,
      metadata: {
        queueCode: result.queueCode,
        skippedQueueNumber: result.skippedQueueNumber,
      },
    });

    // Emit socket updates
    const io = req.app.get("io");
    if (io) {
      // Notify patient they were skipped
      notifyPatientSkipped(
        io,
        result.queueCode,
        result.skippedQueueNumber,
        result.queue.service.name,
      );

      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");

      // Emit queue history update to patient
      io.to(`queueHistory_${result.queue.patient._id}`).emit(
        "queueHistoryUpdate",
        {
          _id: result.queue._id,
          queueCode: result.queueCode,
          queueNumber: result.skippedQueueNumber,
          status: "skipped",
          service: {
            _id: result.queue.service._id,
            name: result.queue.service.name,
          },
          skippedAt: new Date(),
        },
      );
    }

    res.json({
      message: "Patient skipped",
      queue: {
        queueCode: result.queueCode,
        queueNumber: result.skippedQueueNumber,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Get all active queues across all services
 */
exports.getAllActiveQueues = async (req, res) => {
  try {
    const services = await QueueService.getAllActiveQueues();

    res.json(QueueResponseFormatter.formatAllActiveQueuesResponse(services));
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Get queue display data (public endpoint for TV display)
 * Shows all services with active queues
 */
exports.getQueueDisplay = async (req, res) => {
  try {
    const Service = require("../models/serviceSchema");
    const Queue = require("../models/queueSchema");
    const { getTodayMidnight } = require("../utils/dateHelper");

    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    // Get all services
    const allServices = await Service.find({ status: "available" });

    // Get active queues for all services
    const servicesWithQueues = await Promise.all(
      allServices.map(async (service) => {
        // Get all queues for today (waiting or serving)
        const queues = await Queue.find({
          service: service._id,
          date: { $gte: sessionStart, $lt: nextSessionStart },
          status: { $in: ["waiting", "serving"] },
        })
          .populate("patient", "firstName lastName priorityStatus")
          .sort({ queueNumber: 1 });

        // Skip services with no active queues
        if (queues.length === 0) {
          return null;
        }

        // Find currently serving queue
        const currentlyServing = queues.find((q) => q.status === "serving");

        // Get upcoming queues (waiting) and sort by priority
        const upcomingQueues = queues
          .filter((q) => q.status === "waiting")
          .map((q) => ({
            _id: q._id,
            queueCode: q.queueCode,
            queueNumber: q.queueNumber,
            priorityStatus: q.patient?.priorityStatus || "None",
            isUrgent: false, // You can add urgent logic based on wait time or other criteria
          }))
          .sort((a, b) => {
            // Priority order: Senior Citizen > PWD > None
            const priorityOrder = { "Senior Citizen": 0, PWD: 1, None: 2 };
            const aPriority = priorityOrder[a.priorityStatus] ?? 2;
            const bPriority = priorityOrder[b.priorityStatus] ?? 2;

            if (aPriority !== bPriority) {
              return aPriority - bPriority;
            }
            // If same priority, sort by queue number
            return a.queueNumber - b.queueNumber;
          });

        // Count waiting patients
        const waitingCount = upcomingQueues.length;

        return {
          _id: service._id,
          name: service.name,
          description: service.description,
          identifier: service.identifier,
          currentlyServing: currentlyServing
            ? {
                _id: currentlyServing._id,
                queueCode: currentlyServing.queueCode,
                queueNumber: currentlyServing.queueNumber,
                priorityStatus:
                  currentlyServing.patient?.priorityStatus || "None",
              }
            : null,
          upcomingQueues,
          waitingCount,
        };
      }),
    );

    // Filter out services with no queues
    const activeServices = servicesWithQueues.filter(
      (service) => service !== null,
    );

    res.json({
      services: activeServices,
      lastUpdated: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Get queue history for a patient
 */
exports.getQueueHistory = async (req, res) => {
  try {
    const patientId = req.user.id;
    const Queue = require("../models/queueSchema");

    // Get all past queues for this patient (completed, cancelled, or skipped)
    const queueHistory = await Queue.find({
      patient: patientId,
      status: { $in: ["completed", "cancelled", "skipped"] },
    })
      .populate("service", "name identifier")
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      queueHistory: queueHistory.map((queue) => ({
        _id: queue._id,
        queueCode: queue.queueCode,
        queueNumber: queue.queueNumber,
        status: queue.status,
        service: queue.service,
        createdAt: queue.createdAt,
        completedAt: queue.completedAt,
        cancelledAt: queue.cancelledAt,
        skippedAt: queue.skippedAt,
      })),
    });
  } catch (err) {
    console.error("Error fetching queue history:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};
