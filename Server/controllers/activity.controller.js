const ActivityLogger = require("../utils/activityLogger");

exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = await ActivityLogger.getRecentActivities(limit);

    res.json({ activities });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
