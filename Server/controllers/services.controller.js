const Service = require("../models/serviceSchema");

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json({ services });
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
    res.json({ message: "Service updated", service });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
