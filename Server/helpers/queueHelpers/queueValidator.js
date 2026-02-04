const Queue = require("../../models/queueSchema");

class QueueValidator {
  /**
   * Check if patient already has an active queue today
   */
  async checkExistingQueue(patientId, sessionStart, nextSessionStart) {
    return await Queue.findOne({
      patient: patientId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving"] },
    }).populate("service", "name");
  }

  /**
   * Validate if service has reached queue limit
   */
  async isQueueLimitReached(
    serviceId,
    sessionStart,
    nextSessionStart,
    queueLimit,
  ) {
    if (queueLimit === null) {
      return false;
    }

    const activeCount = await Queue.countDocuments({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving"] },
    });

    return activeCount >= queueLimit;
  }
}

module.exports = new QueueValidator();
