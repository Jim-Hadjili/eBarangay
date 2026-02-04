// Server/models/medicalRecordSchema.js
const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    queue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: false,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Update History
    updateHistory: [
      {
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        updatedAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
    // Chief Complaint
    chiefComplaint: {
      type: String,
      required: true,
    },
    // Vital Signs
    vitalSigns: {
      bloodPressure: { type: String, default: "" },
      temperature: { type: String, default: "" },
      pulseRate: { type: String, default: "" },
      respiratoryRate: { type: String, default: "" },
      weight: { type: String, default: "" },
      height: { type: String, default: "" },
    },
    // Assessment/Diagnosis
    diagnosis: {
      type: String,
      default: "",
    },
    // Treatment/Notes
    treatmentNotes: {
      type: String,
      default: "",
    },
    // Prescriptions (simplified - just array of strings)
    prescriptions: [
      {
        type: String,
      },
    ],
    // Additional Notes
    additionalNotes: {
      type: String,
      default: "",
    },
    // Date of visit
    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Index for efficient queries
medicalRecordSchema.index({ patient: 1, visitDate: -1 });
medicalRecordSchema.index({ service: 1, visitDate: -1 });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
