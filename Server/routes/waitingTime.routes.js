const express = require("express");
const router = express.Router();
const waitingTimeController = require("../controllers/waitingTime.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @route   GET /api/waiting-time/service/:serviceId
 * @desc    Get estimated waiting times for all patients in a service queue
 * @access  Public (can be viewed by anyone, including patients and admins)
 */
router.get("/service/:serviceId", waitingTimeController.getServiceWaitingTimes);

/**
 * @route   GET /api/waiting-time/patient/:queueId
 * @desc    Get estimated waiting time for a specific patient
 * @access  Private (requires authentication)
 */
router.get(
  "/patient/:queueId",
  authMiddleware,
  waitingTimeController.getPatientWaitingTime,
);

/**
 * @route   GET /api/waiting-time/average/:serviceId
 * @desc    Get average consultation time for a service
 * @access  Public
 */
router.get(
  "/average/:serviceId",
  waitingTimeController.getAverageConsultationTime,
);

module.exports = router;
