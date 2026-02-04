const Service = require("../models/serviceSchema");
const Queue = require("../models/queueSchema");
const User = require("../models/userSchema");
const ActivityLogger = require("../utils/activityLogger");
const { emitDashboardUpdate } = require("./dashboard.controller");
const { notifyWaitingTimeUpdate } = require("../utils/socketNotifications");
const { getTodayMidnight } = require("../utils/dateHelper");

exports.startMonitoring = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const adminId = req.user.id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if admin is already monitoring another service
    const currentlyMonitoring = await Service.findOne({
      monitoredBy: adminId,
      _id: { $ne: serviceId }, // Exclude the current service
    });

    if (currentlyMonitoring) {
      return res.status(409).json({
        message: "You are already monitoring another service",
        currentService: {
          _id: currentlyMonitoring._id,
          name: currentlyMonitoring.name,
          identifier: currentlyMonitoring.identifier,
        },
      });
    }

    // Check if service is already being monitored by another admin
    if (service.monitoredBy && service.monitoredBy.toString() !== adminId) {
      const monitoringAdmin = await User.findById(service.monitoredBy);
      return res.status(409).json({
        message: "Service is already being monitored",
        monitoredBy: monitoringAdmin
          ? `${monitoringAdmin.firstName} ${monitoringAdmin.lastName}`
          : "Another admin",
      });
    }

    // Start monitoring
    service.monitoredBy = adminId;
    service.monitoringSince = new Date();
    await service.save();

    const admin = await User.findById(adminId);

    // Log activity
    await ActivityLogger.log({
      activityType: "monitoring_started",
      description: `${admin.firstName} ${admin.lastName} started monitoring ${service.name}`,
      performedBy: adminId,
      service: serviceId,
    });

    // Emit dashboard update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");

      // Emit initial waiting time update when monitoring starts
      notifyWaitingTimeUpdate(io, serviceId);
    }

    res.json({
      message: "Monitoring started",
      service: {
        _id: service._id,
        name: service.name,
        identifier: service.identifier,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.stopMonitoring = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const adminId = req.user.id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if current admin is monitoring this service
    if (!service.monitoredBy || service.monitoredBy.toString() !== adminId) {
      return res.status(403).json({
        message: "You are not monitoring this service",
      });
    }

    const admin = await User.findById(adminId);

    // Stop monitoring
    service.monitoredBy = null;
    service.monitoringSince = null;
    await service.save();

    // Log activity
    await ActivityLogger.log({
      activityType: "monitoring_stopped",
      description: `${admin.firstName} ${admin.lastName} stopped monitoring ${service.name}`,
      performedBy: adminId,
      service: serviceId,
    });

    // Emit dashboard update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({ message: "Monitoring stopped" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getServiceDetails = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId).populate(
      "monitoredBy",
      "firstName lastName",
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Get today's date using the same logic as queue creation
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    // Get active queues for this service (waiting or serving)
    const queues = await Queue.find({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving"] },
    })
      .populate(
        "patient",
        "firstName lastName email phone dateOfBirth gender address priorityStatus",
      )
      .sort({ queueNumber: 1 });

    // Get skipped patients for recall list
    const skippedQueues = await Queue.find({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: "skipped",
    })
      .populate(
        "patient",
        "firstName lastName email phone dateOfBirth gender address priorityStatus",
      )
      .sort({ skippedAt: 1 }); // Sort by when they were skipped

    // Find the queue that is currently being served (only if status is "serving")
    const currentQueue = queues.find((q) => q.status === "serving") || null;

    res.json({
      service: {
        _id: service._id,
        name: service.name,
        identifier: service.identifier,
        description: service.description,
        queueLimit: service.queueLimit,
        status: service.status,
        monitoredBy: service.monitoredBy
          ? {
              _id: service.monitoredBy._id,
              name: `${service.monitoredBy.firstName} ${service.monitoredBy.lastName}`,
            }
          : null,
        monitoringSince: service.monitoringSince,
      },
      currentQueue: currentQueue
        ? {
            _id: currentQueue._id,
            queueCode: currentQueue.queueCode,
            queueNumber: currentQueue.queueNumber,
            status: currentQueue.status,
            patient: currentQueue.patient,
          }
        : null,
      queues: queues.map((q) => ({
        _id: q._id,
        queueCode: q.queueCode,
        queueNumber: q.queueNumber,
        status: q.status,
        patient: q.patient,
      })),
      skippedQueues: skippedQueues.map((q) => ({
        _id: q._id,
        queueCode: q.queueCode,
        queueNumber: q.queueNumber,
        status: q.status,
        patient: q.patient,
        skippedAt: q.skippedAt,
      })),
      totalWaiting: queues.filter((q) => q.status === "waiting").length,
      totalSkipped: skippedQueues.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
