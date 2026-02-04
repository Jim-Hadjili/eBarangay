const notifyNextInQueue = (io, queueCode, queueNumber, serviceName) => {
  io.to(queueCode).emit("yourTurn", {
    message: `It's your turn! Please proceed to ${serviceName}`,
    queueCode,
    queueNumber,
    serviceName,
  });

  // Also emit to a general display channel for TV screens
  io.emit("queueCalled", {
    queueCode,
    queueNumber,
    serviceName,
    timestamp: new Date(),
  });
};

const notifyPatientSkipped = (io, queueCode, queueNumber, serviceName) => {
  io.to(queueCode).emit("patientSkipped", {
    message: `You have been skipped for not responding in time. You will be moved to the back of the queue.`,
    queueCode,
    queueNumber,
    serviceName,
  });
};

const notifyQueueUpdate = (io, serviceId, queueData) => {
  io.to(`service-${serviceId}`).emit("queueUpdated", queueData);
};

const notifyWaitingTimeUpdate = async (io, serviceId) => {
  try {
    const WaitingTimeService = require("../services/waitingTime.service");
    const result = await WaitingTimeService.getEstimatedWaitingTimes(serviceId);

    if (result.isMonitored) {
      // Emit to service monitoring room
      io.to(`service-${serviceId}`).emit("waitingTimeUpdate", result);

      // Emit individual updates to each patient in queue
      result.waitingTimes.forEach((waitingTime) => {
        io.to(waitingTime.queueCode).emit("yourWaitingTime", {
          estimatedWaitingTime: waitingTime.estimatedWaitingTime,
          estimatedWaitingTimeFormatted:
            waitingTime.estimatedWaitingTimeFormatted,
          position: waitingTime.position,
          averageConsultationTime: result.averageConsultationTime,
        });
      });
    }
  } catch (error) {
    console.error("Error notifying waiting time update:", error);
  }
};

module.exports = {
  notifyNextInQueue,
  notifyPatientSkipped,
  notifyQueueUpdate,
  notifyWaitingTimeUpdate,
};
