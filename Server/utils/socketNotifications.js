const notifyNextInQueue = (io, queueCode, queueNumber, serviceName) => {
  io.to(queueCode).emit("yourTurn", {
    message: `It's your turn! Please proceed to ${serviceName}`,
    queueCode,
    queueNumber,
    serviceName,
  });
};

const notifyQueueUpdate = (io, serviceId, queueData) => {
  io.to(`service-${serviceId}`).emit("queueUpdated", queueData);
};

module.exports = {
  notifyNextInQueue,
  notifyQueueUpdate,
};
