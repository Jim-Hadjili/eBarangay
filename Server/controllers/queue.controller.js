const Queue = require("../models/queueSchema");
const Service = require("../models/serviceSchema");
const User = require("../models/userSchema");
const { notifyNextInQueue } = require("../utils/socketNotifications");
const { emitDashboardUpdate } = require("./dashboard.controller");
const ActivityLogger = require("../utils/activityLogger");

exports.joinQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const patientId = req.user.id;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const patient = await User.findById(patientId);

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user already has a queue today for ANY service
    const existingQueue = await Queue.findOne({
      patient: patientId,
      date: today,
    }).populate("service", "name");

    if (existingQueue) {
      return res.status(400).json({
        message: `You already have a queue today for ${existingQueue.service.name}`,
        queueCode: existingQueue.queueCode,
      });
    }

    // Count today's queue for this service
    const count = await Queue.countDocuments({
      service: serviceId,
      date: today,
    });

    if (service.queueLimit !== null && count >= service.queueLimit) {
      return res.status(400).json({ message: "Queue is full for today" });
    }

    const queueNumber = count + 1;
    const queueCode = `${service.identifier}-${String(queueNumber).padStart(
      3,
      "0"
    )}`;

    const queueEntry = await Queue.create({
      service: serviceId,
      serviceIdentifier: service.identifier,
      queueNumber,
      queueCode,
      patient: patientId,
      date: today,
    });

    // Log activity
    await ActivityLogger.log({
      activityType: "queue_joined",
      description: `${patient.firstName} ${patient.lastName} joined ${service.name} queue`,
      performedBy: patientId,
      service: serviceId,
      queue: queueEntry._id,
      metadata: { queueCode, queueNumber },
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.status(201).json({
      message: "Joined queue",
      queue: {
        queueCode,
        queueNumber,
        service: service.name,
        date: today,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getServiceQueue = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's queue for this service
    const queue = await Queue.find({
      service: serviceId,
      date: today,
    }).populate("patient", "firstName lastName");

    const nextNumber = queue.length + 1;
    const limit = service.queueLimit;

    res.json({
      queue: queue.map((entry) => ({
        queueCode: entry.queueCode,
        patientName: entry.patient
          ? `${entry.patient.firstName} ${entry.patient.lastName}`
          : "Patient",
      })),
      nextNumber: limit !== null && nextNumber > limit ? null : nextNumber,
      limit,
      identifier: service.identifier,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserQueue = async (req, res) => {
  try {
    const patientId = req.user.id;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find user's queue today
    const userQueue = await Queue.findOne({
      patient: patientId,
      date: today,
    }).populate("service", "name identifier queueLimit");

    if (!userQueue) {
      return res.json({ hasQueue: false });
    }

    // Check if queue limit is reached
    const count = await Queue.countDocuments({
      service: userQueue.service._id,
      date: today,
    });

    res.json({
      hasQueue: true,
      queue: {
        queueCode: userQueue.queueCode,
        queueNumber: userQueue.queueNumber,
        serviceName: userQueue.service.name,
        serviceId: userQueue.service._id,
        isLimitReached: count >= userQueue.service.queueLimit,
        queueLimit: userQueue.service.queueLimit,
        currentCount: count,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.cancelQueue = async (req, res) => {
  try {
    const patientId = req.user.id;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find user's queue today
    const userQueue = await Queue.findOne({
      patient: patientId,
      date: today,
    }).populate("service", "identifier name");

    if (!userQueue) {
      return res.status(404).json({ message: "No active queue found" });
    }

    const canceledQueueNumber = userQueue.queueNumber;
    const serviceId = userQueue.service._id;
    const serviceIdentifier = userQueue.service.identifier;
    const queueCode = userQueue.queueCode;

    const patient = await User.findById(patientId);

    // Delete the user's queue
    await Queue.deleteOne({ _id: userQueue._id });

    // Find all queues with higher queue numbers in the same service today
    const higherQueues = await Queue.find({
      service: serviceId,
      date: today,
      queueNumber: { $gt: canceledQueueNumber },
    }).sort({ queueNumber: 1 });

    // Reorder queue numbers
    for (const queue of higherQueues) {
      const newQueueNumber = queue.queueNumber - 1;
      const newQueueCode = `${serviceIdentifier}-${String(
        newQueueNumber
      ).padStart(3, "0")}`;

      await Queue.updateOne(
        { _id: queue._id },
        {
          queueNumber: newQueueNumber,
          queueCode: newQueueCode,
        }
      );
    }

    // Log activity
    await ActivityLogger.log({
      activityType: "queue_cancelled",
      description: `${patient.firstName} ${patient.lastName} cancelled queue ${queueCode} for ${userQueue.service.name}`,
      performedBy: patientId,
      service: serviceId,
      metadata: { queueCode, canceledQueueNumber },
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({
      message: "Queue canceled successfully",
      reorderedCount: higherQueues.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.callNextInQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the next person in queue (lowest queue number)
    const nextQueue = await Queue.findOne({
      service: serviceId,
      date: today,
    }).sort({ queueNumber: 1 });

    if (!nextQueue) {
      return res.status(404).json({ message: "No one in queue" });
    }

    // Send Socket.io notification
    const io = req.app.get("io");
    notifyNextInQueue(
      io,
      nextQueue.queueCode,
      nextQueue.queueNumber,
      service.name
    );

    res.json({
      message: "Next person called",
      queue: {
        queueCode: nextQueue.queueCode,
        queueNumber: nextQueue.queueNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.markAsServed = async (req, res) => {
  try {
    const { queueId } = req.params;

    const queue = await Queue.findById(queueId)
      .populate("service", "identifier name")
      .populate("patient", "firstName lastName");

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const serviceId = queue.service._id;
    const serviceIdentifier = queue.service.identifier;
    const servedQueueNumber = queue.queueNumber;
    const queueCode = queue.queueCode;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Delete the served queue
    await Queue.deleteOne({ _id: queueId });

    // Find all queues with higher queue numbers in the same service today
    const higherQueues = await Queue.find({
      service: serviceId,
      date: today,
      queueNumber: { $gt: servedQueueNumber },
    }).sort({ queueNumber: 1 });

    // Reorder queue numbers
    for (const higherQueue of higherQueues) {
      const newQueueNumber = higherQueue.queueNumber - 1;
      const newQueueCode = `${serviceIdentifier}-${String(
        newQueueNumber
      ).padStart(3, "0")}`;

      await Queue.updateOne(
        { _id: higherQueue._id },
        {
          queueNumber: newQueueNumber,
          queueCode: newQueueCode,
        }
      );
    }

    // Log activity
    await ActivityLogger.log({
      activityType: "queue_completed",
      description: `Queue ${queueCode} completed for ${queue.patient.firstName} ${queue.patient.lastName} at ${queue.service.name}`,
      performedBy: req.user.id,
      targetUser: queue.patient._id,
      service: serviceId,
      metadata: { queueCode, servedQueueNumber },
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({
      message: "Queue marked as served",
      reorderedCount: higherQueues.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
