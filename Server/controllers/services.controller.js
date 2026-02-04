const Service = require("../models/serviceSchema");
const Queue = require("../models/queueSchema");
const { emitDashboardUpdate } = require("./dashboard.controller");
const ActivityLogger = require("../utils/activityLogger");
const { getTodayMidnight } = require("../utils/dateHelper");

// Get all services with current queue count
exports.getAllServices = async (req, res) => {
  try {
    // Get session start time (7:00 PM of current session)
    const sessionStart = getTodayMidnight();

    // Get next session start (24 hours later)
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const services = await Service.find();

    // Get queue count for each service
    const servicesWithQueue = await Promise.all(
      services.map(async (service) => {
        // Count for display (only active waiting/serving patients)
        const activeQueueCount = await Queue.countDocuments({
          service: service._id,
          createdAt: {
            $gte: sessionStart,
            $lt: nextSessionStart,
          },
          status: { $in: ["waiting", "serving"] },
        });

        // Count for limit check (all slots issued except cancelled)
        const totalSlotsIssued = await Queue.countDocuments({
          service: service._id,
          createdAt: {
            $gte: sessionStart,
            $lt: nextSessionStart,
          },
          status: { $ne: "cancelled" },
        });

        // Determine status based on service.status and queue limit
        let displayStatus = service.status || "available";
        if (service.status === "available") {
          if (
            service.queueLimit !== null &&
            totalSlotsIssued >= service.queueLimit
          ) {
            displayStatus = "full";
          } else {
            displayStatus = "active";
          }
        } else {
          displayStatus = "unavailable";
        }

        return {
          _id: service._id,
          id: service.identifier,
          name: service.name,
          description: service.description,
          identifier: service.identifier,
          queueLimit: service.queueLimit,
          queue: activeQueueCount, // Show only active waiting count
          status: displayStatus,
          serviceStatus: service.status || "available", // Add the actual service status
        };
      }),
    );

    res.json({ services: servicesWithQueue });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create a new service (admin only)
exports.createService = async (req, res) => {
  try {
    const { identifier, name, description, queueLimit, status } = req.body;
    if (!identifier || !name || !description)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await Service.findOne({ identifier });
    if (exists)
      return res
        .status(409)
        .json({ message: "Service with this identifier already exists" });

    const service = await Service.create({
      identifier,
      name,
      description,
      queueLimit,
      status: status || "available",
    });

    // Log activity
    await ActivityLogger.log({
      activityType: "service_created",
      description: `New service created: ${name}`,
      performedBy: req.user?.id || null,
      service: service._id,
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.status(201).json({ message: "Service created", service });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Edit a service (admin only)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { identifier, name, description, queueLimit, status } = req.body;

    const updateData = { name, description };
    if (queueLimit !== undefined) {
      updateData.queueLimit = queueLimit;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (identifier !== undefined) {
      updateData.identifier = identifier;
    }

    // Find by old identifier, update with new identifier (and other fields)
    const service = await Service.findOneAndUpdate(
      { identifier: id },
      updateData,
      { new: true },
    );

    if (!service) return res.status(404).json({ message: "Service not found" });

    // Log activity
    await ActivityLogger.log({
      activityType: "service_updated",
      description: `Service updated: ${name}`,
      performedBy: req.user?.id || null,
      service: service._id,
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({ message: "Service updated", service });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a service (admin only)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findOne({ identifier: id });
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Check if there are any active queues for this service
    const sessionStart = getTodayMidnight();
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const activeQueues = await Queue.countDocuments({
      service: service._id,
      createdAt: {
        $gte: sessionStart,
        $lt: nextSessionStart,
      },
      status: { $in: ["waiting", "serving"] },
    });

    if (activeQueues > 0) {
      return res.status(400).json({
        message: "Cannot delete service with active queues",
      });
    }

    await Service.findByIdAndDelete(service._id);

    // Log activity
    await ActivityLogger.log({
      activityType: "service_deleted",
      description: `Service deleted: ${service.name}`,
      performedBy: req.user?.id || null,
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
