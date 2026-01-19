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
        "queue_joined",
        "queue_completed",
        "queue_cancelled",
        "service_created",
        "service_updated",
        "service_disabled",
        "user_login",
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
  { timestamps: true }
);

// Index for faster queries
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ activityType: 1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
