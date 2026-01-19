const User = require("../models/userSchema");
const Service = require("../models/serviceSchema");
const Queue = require("../models/queueSchema");

exports.getDashboardStats = async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total Patients (all users with userType 'Patient')
    const totalPatients = await User.countDocuments({ userType: "Patient" });

    // Active Services
    const activeServices = await Service.countDocuments();

    // Queue Today (total queues for today)
    const queueToday = await Queue.countDocuments({ date: today });

    // Total Staff Available (all users with userType 'Admin' or 'Staff')
    const totalStaff = await User.countDocuments({
      userType: { $in: ["Admin", "Staff"] },
    });

    res.json({
      totalPatients,
      activeServices,
      queueToday,
      totalStaff,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Helper function to emit dashboard updates
exports.emitDashboardUpdate = async (io) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalPatients = await User.countDocuments({ userType: "Patient" });
    const activeServices = await Service.countDocuments();
    const queueToday = await Queue.countDocuments({ date: today });
    const totalStaff = await User.countDocuments({
      userType: { $in: ["Admin", "Staff"] },
    });

    io.to("dashboard").emit("dashboardUpdate", {
      totalPatients,
      activeServices,
      queueToday,
      totalStaff,
    });
  } catch (err) {
    console.error("Error emitting dashboard update:", err);
  }
};
