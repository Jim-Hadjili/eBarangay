const ActivityLog = require("../models/activityLogSchema");

class ActivityLogger {
  static async log({
    activityType,
    description,
    performedBy = null,
    targetUser = null,
    service = null,
    queue = null,
    metadata = {},
  }) {
    try {
      await ActivityLog.create({
        activityType,
        description,
        performedBy,
        targetUser,
        service,
        queue,
        metadata,
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  }

  static async getRecentActivities(limit = 20) {
    try {
      const activities = await ActivityLog.find({
        activityType: { $nin: ["user_login", "user_logout"] },
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("performedBy", "firstName lastName email")
        .populate("targetUser", "firstName lastName email")
        .populate("service", "name identifier")
        .populate("queue", "queueCode queueNumber");

      return activities;
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [];
    }
  }
}

module.exports = ActivityLogger;
