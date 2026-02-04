const Queue = require("../../models/queueSchema");

class QueueNumberManager {
  /**
   * Get the next available queue number for a service
   * Ensures sequential numbering after cancellations and prevents reuse
   */
  async getNextQueueNumber(serviceId, sessionStart, nextSessionStart) {
    // Get highest from active queues (including skipped for sequential numbering)
    const highestActiveQueue = await Queue.findOne({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving", "skipped"] },
    })
      .sort({ queueNumber: -1 })
      .limit(1);

    const highestActive = highestActiveQueue?.queueNumber || 0;

    // If there are active queues, use that as the basis
    // (reordering already handles sequential numbering)
    if (highestActive > 0) {
      return highestActive + 1;
    }

    // If no active queues, check only COMPLETED to avoid reuse
    // (cancelled numbers are freed up after reordering)
    const highestCompletedQueue = await Queue.findOne({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: "completed",
    })
      .sort({ queueNumber: -1 })
      .limit(1);

    const highestCompleted = highestCompletedQueue?.queueNumber || 0;

    return highestCompleted + 1;
  }

  /**
   * Generate queue code from identifier and number
   */
  generateQueueCode(identifier, queueNumber) {
    return `${identifier}-${String(queueNumber).padStart(3, "0")}`;
  }

  /**
   * Reorder queues after a cancellation
   * Decrements queue numbers for all higher active queues
   */
  async reorderQueuesAfterCancellation(
    serviceId,
    sessionStart,
    nextSessionStart,
    canceledQueueNumber,
    serviceIdentifier,
  ) {
    // Find all active queues with higher numbers
    const higherQueues = await Queue.find({
      service: serviceId,
      date: { $gte: sessionStart, $lt: nextSessionStart },
      status: { $in: ["waiting", "serving"] },
      queueNumber: { $gt: canceledQueueNumber },
    }).sort({ queueNumber: 1 });

    // Reorder each queue
    for (const queue of higherQueues) {
      const newQueueNumber = queue.queueNumber - 1;
      const newQueueCode = this.generateQueueCode(
        serviceIdentifier,
        newQueueNumber,
      );

      await Queue.updateOne(
        { _id: queue._id },
        {
          queueNumber: newQueueNumber,
          queueCode: newQueueCode,
        },
      );
    }

    return higherQueues.length;
  }
}

module.exports = new QueueNumberManager();
