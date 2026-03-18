// models/pendingRegistrationSchema.js
const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: null },
    address: { type: String, default: null },
    priorityStatus: { type: String, default: "None" },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Auto-delete after 1 hour
  },
});

module.exports = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema,
);
