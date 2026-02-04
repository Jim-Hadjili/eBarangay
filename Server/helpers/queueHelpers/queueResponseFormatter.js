class QueueResponseFormatter {
  /**
   * Format join queue response
   */
  static formatJoinQueueResponse(queueCode, queueNumber, serviceName, date) {
    return {
      message: "Joined queue",
      queue: {
        queueCode,
        queueNumber,
        service: serviceName,
        date,
      },
    };
  }

  /**
   * Format service queue response
   */
  static formatServiceQueueResponse(queue, nextNumber, limit, identifier) {
    return {
      queue: queue.map((entry) => ({
        queueCode: entry.queueCode,
        queueNumber: entry.queueNumber,
        status: entry.status,
        patientName: entry.patient
          ? `${entry.patient.firstName} ${entry.patient.lastName}`
          : "Patient",
      })),
      nextNumber,
      limit,
      identifier,
    };
  }

  /**
   * Format cancel queue response
   */
  static formatCancelQueueResponse(reorderedCount) {
    return {
      message: "Queue canceled successfully",
      reorderedCount,
    };
  }

  /**
   * Format call next response
   */
  static formatCallNextResponse(queueCode, queueNumber) {
    return {
      message: "Next person called",
      queue: {
        queueCode,
        queueNumber,
      },
    };
  }

  /**
   * Format mark as served response
   */
  static formatMarkAsServedResponse(queueCode, queueNumber) {
    return {
      message: "Queue marked as served",
      queueCode,
      queueNumber,
    };
  }

  /**
   * Format all active queues response
   */
  static formatAllActiveQueuesResponse(services) {
    return {
      services,
    };
  }
}

module.exports = QueueResponseFormatter;
