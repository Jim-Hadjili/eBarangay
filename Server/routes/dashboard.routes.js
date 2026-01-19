const router = require("express").Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");
const auth = require("../middlewares/auth.middleware");

// Get dashboard statistics (admin only)
router.get("/stats", auth, getDashboardStats);

module.exports = router;
