const router = require("express").Router();
const { getRecentActivities } = require("../controllers/activity.controller");
const auth = require("../middlewares/auth.middleware");

// Get recent activities (admin only)
router.get("/recent", auth, getRecentActivities);

module.exports = router;
