const WaitingTimeService = require("../services/waitingTime.service");
const ActivityLogger = require("../utils/activityLogger");

/**
 * Get estimated waiting times for all patients in a service queue
 */
exports.getServiceWaitingTimes = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const result = await WaitingTimeService.getEstimatedWaitingTimes(serviceId);

    res.json(result);
  } catch (err) {
    const status = err.message === "Service not found" ? 404 : 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Get estimated waiting time for a specific patient
 */
exports.getPatientWaitingTime = async (req, res) => {
  try {
    const { queueId } = req.params;

    const result = await WaitingTimeService.getPatientWaitingTime(queueId);

    res.json(result);
  } catch (err) {
    const status = err.message === "Queue entry not found" ? 404 : 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};

/**
 * Get average consultation time for a service
 */
exports.getAverageConsultationTime = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const result =
      await WaitingTimeService.getAverageConsultationTime(serviceId);

    res.json(result);
  } catch (err) {
    const status = err.message === "Service not found" ? 404 : 500;
    res.status(status).json({
      message: err.message || "Server error",
    });
  }
};
