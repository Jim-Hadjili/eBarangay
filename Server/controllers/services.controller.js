const Service = require("../models/serviceSchema");
const Queue = require("../models/queueSchema");
const { emitDashboardUpdate } = require("./dashboard.controller");
const ActivityLogger = require("../utils/activityLogger");

// Get all services with current queue count
exports.getAllServices = async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const services = await Service.find();

    // Get queue count for each service
    const servicesWithQueue = await Promise.all(
      services.map(async (service) => {
        const queueCount = await Queue.countDocuments({
          service: service._id,
          date: today,
        });

        return {
          _id: service._id,
          id: service.identifier,
          name: service.name,
          description: service.description,
          identifier: service.identifier,
          queueLimit: service.queueLimit,
          queue: queueCount,
          status:
            queueCount >= service.queueLimit && service.queueLimit
              ? "full"
              : "active",
        };
      })
    );

    res.json({ services: servicesWithQueue });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create a new service (admin only)
exports.createService = async (req, res) => {
  try {
    const { id, name, description } = req.body;
    if (!id || !name || !description)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await Service.findOne({ id });
    if (exists)
      return res
        .status(409)
        .json({ message: "Service with this ID already exists" });

    const service = await Service.create({ id, name, description });

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
    const { name, description } = req.body;
    const service = await Service.findOneAndUpdate(
      { id },
      { name, description },
      { new: true }
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
