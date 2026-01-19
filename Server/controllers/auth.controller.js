// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const { emitDashboardUpdate } = require("./dashboard.controller");
const ActivityLogger = require("../utils/activityLogger");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // Log activity
    await ActivityLogger.log({
      activityType: "user_login",
      description: `${user.firstName} ${user.lastName} logged in`,
      performedBy: user._id,
      metadata: { userType: user.userType },
    });

    res.json({
      message: "Login successful",
      token,
      userType: user.userType,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      userType: "Patient",
    });

    // Log activity
    await ActivityLogger.log({
      activityType: "patient_registered",
      description: `New patient registered: ${firstName} ${lastName}`,
      targetUser: user._id,
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;
    const performedById = req.user.id;

    if (!firstName || !lastName || !email || !password || !userType)
      return res.status(400).json({ message: "All fields are required" });

    if (!["Admin", "Staff"].includes(userType))
      return res.status(400).json({ message: "Invalid user type" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      userType,
    });

    const performedBy = await User.findById(performedById);

    // Log activity
    await ActivityLogger.log({
      activityType: userType === "Admin" ? "admin_added" : "staff_added",
      description: `${userType} added: ${firstName} ${lastName} by ${performedBy.firstName} ${performedBy.lastName}`,
      performedBy: performedById,
      targetUser: newUser._id,
      metadata: { addedUserType: userType },
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.status(201).json({
      message: `${userType} added successfully`,
      userId: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
  } catch (err) {
    console.error("Add admin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
