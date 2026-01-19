const router = require("express").Router();
const {
  getDashboardStats,
  getAdminUsers,
  getPatients,
} = require("../controllers/dashboard.controller");
const auth = require("../middlewares/auth.middleware");

// Get dashboard statistics (admin only)
router.get("/stats", auth, getDashboardStats);

// Get admin users (admin only)
router.get("/admin-users", auth, getAdminUsers);

// Get patients (admin only)
router.get("/patients", auth, getPatients);

module.exports = router;
