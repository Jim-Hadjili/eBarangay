const Queue = require("../models/queueSchema");
const Service = require("../models/serviceSchema");
const User = require("../models/userSchema");
const { notifyNextInQueue } = require("../utils/socketNotifications");

exports.joinQueue = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const patientId = req.user.id;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

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
        message: `You already have a queue today for ${existingQueue.service.name} (${existingQueue.queueCode})`,
        existingQueue: {
          queueCode: existingQueue.queueCode,
          serviceName: existingQueue.service.name,
        },
      });
    }

    // Count today's queue for this service
    const count = await Queue.countDocuments({
      service: serviceId,
      date: today,
    });

    if (count >= service.queueLimit) {
      return res.status(400).json({ message: "Queue limit reached for today" });
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
      nextNumber: nextNumber > limit ? null : nextNumber,
      limit,
      identifier: service.identifier,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add new endpoint to check user's current queue
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

// Cancel queue and reorder
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
    }).populate("service", "identifier");

    if (!userQueue) {
      return res.status(404).json({ message: "No active queue found" });
    }

    const canceledQueueNumber = userQueue.queueNumber;
    const serviceId = userQueue.service._id;
    const serviceIdentifier = userQueue.service.identifier;

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

    res.json({
      message: "Queue canceled successfully",
      reorderedCount: higherQueues.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin calls the next person in queue
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

// Mark queue as served and remove from queue
exports.markAsServed = async (req, res) => {
  try {
    const { queueId } = req.params;

    const queue = await Queue.findById(queueId).populate(
      "service",
      "identifier"
    );
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const serviceId = queue.service._id;
    const serviceIdentifier = queue.service.identifier;
    const servedQueueNumber = queue.queueNumber;

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
    for (const q of higherQueues) {
      const newQueueNumber = q.queueNumber - 1;
      const newQueueCode = `${serviceIdentifier}-${String(
        newQueueNumber
      ).padStart(3, "0")}`;

      await Queue.updateOne(
        { _id: q._id },
        {
          queueNumber: newQueueNumber,
          queueCode: newQueueCode,
        }
      );
    }

    res.json({
      message: "Queue marked as served",
      reorderedCount: higherQueues.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
