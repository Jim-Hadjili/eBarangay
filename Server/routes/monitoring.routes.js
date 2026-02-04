// Create Server/routes/monitoring.routes.js
const router = require("express").Router();
const {
  startMonitoring,
  stopMonitoring,
  getServiceDetails,
} = require("../controllers/monitoring.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/start", auth, startMonitoring);
router.post("/stop", auth, stopMonitoring);
router.get("/service/:serviceId", auth, getServiceDetails);

module.exports = router;
