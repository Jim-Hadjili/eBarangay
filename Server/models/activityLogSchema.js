const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    activityType: {
      type: String,
      required: true,
      enum: [
        "patient_registered",
        "admin_added",
        "staff_added",
        "admin_deleted",
        "patient_deleted",
        "queue_joined",
        "queue_completed",
        "queue_cancelled",
        "service_created",
        "service_updated",
        "service_disabled",
        "service_deleted",
        "user_login",
        "user_logout",
        "monitoring_started",
        "monitoring_stopped",
        "medical_record_created",
        "medical_record_updated",
        "profile_updated",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    queue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

// Index for faster queries
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ activityType: 1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
