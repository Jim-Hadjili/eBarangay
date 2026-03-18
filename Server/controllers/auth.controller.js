// controllers/auth.controller.js
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const PendingRegistration = require("../models/pendingRegistrationSchema");
const { emitDashboardUpdate } = require("./dashboard.controller");
const ActivityLogger = require("../utils/activityLogger");
const { sendVerificationEmail } = require("../utils/emailService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/profiles");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

exports.uploadProfileImage = upload.single("profileImage");

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
        profileImage: user.profileImage,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        priorityStatus: user.priorityStatus,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
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
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      priorityStatus,
    } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "Required fields are missing" });

    // Check if a verified account already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Remove any previous pending registration for this email
    await PendingRegistration.deleteMany({ "data.email": email });

    // Generate a cryptographically secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Store registration data pending email verification
    await PendingRegistration.create({
      token: hashedToken,
      data: {
        firstName,
        lastName,
        email,
        password,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        address: address || null,
        priorityStatus: priorityStatus || "None",
      },
    });

    // Send verification email
    await sendVerificationEmail(email, firstName, rawToken);

    res.status(200).json({
      message:
        "Verification email sent. Please check your inbox and click the link to complete registration.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token)
      return res
        .status(400)
        .json({ message: "Verification token is required" });

    // Hash the incoming token to compare with the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const pending = await PendingRegistration.findOne({ token: hashedToken });
    if (!pending)
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      priorityStatus,
    } = pending.data;

    // Guard against race condition: account already created
    const exists = await User.findOne({ email });
    if (exists) {
      await PendingRegistration.deleteOne({ token: hashedToken });
      return res
        .status(400)
        .json({ message: "Account already exists. Please sign in." });
    }

    // Create the verified user account
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      address: address || null,
      userType: "Patient",
      priorityStatus: priorityStatus || "None",
    });

    // Remove the used pending registration
    await PendingRegistration.deleteOne({ token: hashedToken });

    // Log activity
    await ActivityLogger.log({
      activityType: "patient_registered",
      description: `New patient registered: ${firstName} ${lastName}`,
      targetUser: user._id,
    });

    // Emit dashboard update
    const io = req.app.get("io");
    if (io) {
      await emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.status(201).json({
      message: "Email verified successfully. Your account has been created.",
      userId: user._id,
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      userType,
    } = req.body;
    const performedById = req.user.id;

    if (!firstName || !lastName || !email || !password || !userType)
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });

    if (!["Admin", "Staff"].includes(userType))
      return res.status(400).json({ message: "Invalid user type" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      address: address || null,
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

exports.deleteAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const performedById = req.user.id;

    // Check if the user performing the action is Super Admin
    const performedBy = await User.findById(performedById);
    if (performedBy.userType !== "Super Admin") {
      return res
        .status(403)
        .json({ message: "Only Super Admin can delete users" });
    }

    // Find the user to delete
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting yourself
    if (userId === performedById) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Log activity
    await ActivityLogger.log({
      activityType: "admin_deleted",
      description: `${userToDelete.userType} deleted: ${userToDelete.firstName} ${userToDelete.lastName} by ${performedBy.firstName} ${performedBy.lastName}`,
      performedBy: performedById,
      targetUser: userId,
      metadata: { deletedUserType: userToDelete.userType },
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({
      message: `${userToDelete.userType} deleted successfully`,
      deletedUser: {
        id: userToDelete._id,
        name: `${userToDelete.firstName} ${userToDelete.lastName}`,
      },
    });
  } catch (err) {
    console.error("Delete admin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { userId } = req.params;
    const performedById = req.user.id;

    // Check if the user performing the action is Admin or Super Admin
    const performedBy = await User.findById(performedById);
    if (!["Admin", "Super Admin"].includes(performedBy.userType)) {
      return res
        .status(403)
        .json({ message: "Only Admin users can delete patients" });
    }

    // Find the patient to delete
    const patientToDelete = await User.findById(userId);
    if (!patientToDelete) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Ensure the user to delete is a patient
    if (patientToDelete.userType !== "Patient") {
      return res.status(400).json({ message: "User is not a patient" });
    }

    // Delete the patient
    await User.findByIdAndDelete(userId);

    // Log activity
    await ActivityLogger.log({
      activityType: "patient_deleted",
      description: `Patient deleted: ${patientToDelete.firstName} ${patientToDelete.lastName} by ${performedBy.firstName} ${performedBy.lastName}`,
      performedBy: performedById,
      targetUser: userId,
      metadata: { deletedUserType: patientToDelete.userType },
    });

    // Emit dashboard update and activity update
    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io);
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({
      message: "Patient deleted successfully",
      deletedUser: {
        id: patientToDelete._id,
        name: `${patientToDelete.firstName} ${patientToDelete.lastName}`,
      },
    });
  } catch (err) {
    console.error("Delete patient error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      currentPassword,
      newPassword,
    } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user wants to update password, validate current password
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
    }

    // Prepare update object
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (req.body.priorityStatus !== undefined)
      updateData.priorityStatus = req.body.priorityStatus;
    if (req.body.address !== undefined) updateData.address = req.body.address;

    // Hash and update password if provided
    if (newPassword && currentPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle profile image upload
    if (req.file) {
      // Delete old profile image if exists
      if (user.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "../uploads/profiles",
          path.basename(user.profileImage),
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    // Log activity
    await ActivityLogger.log({
      activityType: "profile_updated",
      description: `${updatedUser.firstName} ${updatedUser.lastName} updated their profile`,
      performedBy: userId,
    });

    // Generate new token with updated information
    const token = jwt.sign(
      {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        userType: updatedUser.userType,
        profileImage: updatedUser.profileImage,
        dateOfBirth: updatedUser.dateOfBirth,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        address: updatedUser.address,
        priorityStatus: updatedUser.priorityStatus,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    // Emit activity update
    const io = req.app.get("io");
    if (io) {
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
      token: token,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
