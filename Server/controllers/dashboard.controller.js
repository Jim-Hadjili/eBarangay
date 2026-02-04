const User = require("../models/userSchema");
const Service = require("../models/serviceSchema");
const Queue = require("../models/queueSchema");
const { getTodayMidnight } = require("../utils/dateHelper");

exports.getDashboardStats = async (req, res) => {
  try {
    // Get session start time (7:00 PM of current session)
    const sessionStart = getTodayMidnight();

    // Get next session start (24 hours later)
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    // Total Patients (all users with userType 'Patient')
    const totalPatients = await User.countDocuments({ userType: "Patient" });

    // Active Services
    const activeServices = await Service.countDocuments();

    // Queue Today (queues within current session: waiting or serving)
    const queueToday = await Queue.countDocuments({
      createdAt: {
        $gte: sessionStart,
        $lt: nextSessionStart,
      },
      status: { $in: ["waiting", "serving"] },
    });

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
    // Get session start time (7:00 PM of current session)
    const sessionStart = getTodayMidnight();

    // Get next session start (24 hours later)
    const nextSessionStart = new Date(sessionStart);
    nextSessionStart.setHours(nextSessionStart.getHours() + 24);

    const totalPatients = await User.countDocuments({ userType: "Patient" });
    const activeServices = await Service.countDocuments();
    const queueToday = await Queue.countDocuments({
      createdAt: {
        $gte: sessionStart,
        $lt: nextSessionStart,
      },
      status: { $in: ["waiting", "serving"] },
    });
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

exports.getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await User.find({
      userType: { $in: ["Admin", "Staff"] },
    })
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      adminUsers: adminUsers.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "N/A",
        role: user.userType,
        status: "active", // You can add a status field to your schema if needed
        createdAt: user.createdAt,
        profileImage: user.profileImage,
        address: user.address || "N/A",
        gender: user.gender || "N/A",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "N/A",
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({
      userType: "Patient",
    })
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 }); // Sort by newest first

    const patientData = patients.map((patient) => ({
      id: patient._id,
      name: `${patient.firstName} ${patient.lastName}`,
      email: patient.email,
      phone: patient.phone || "N/A",
      registeredDate: patient.createdAt
        ? new Date(patient.createdAt).toISOString().split("T")[0]
        : "N/A",
      gender: patient.gender || "N/A",
      address: patient.address || "N/A",
      profileImage: patient.profileImage || null,
      priorityStatus: patient.priorityStatus || "None",
      dateOfBirth: patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
        : "N/A",
    }));

    res.json({
      patients: patientData,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
