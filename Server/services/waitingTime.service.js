const Queue = require("../models/queueSchema");
const Service = require("../models/serviceSchema");
const { getTodayMidnight } = require("../utils/dateHelper");

class WaitingTimeService {
  /**
   * Calculate average consultation time for a service during current monitoring session
   * @param {String} serviceId - The service ID
   * @returns {Object} - { averageConsultationTime (in minutes), completedCount }
   */
  async getAverageConsultationTime(serviceId) {
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      // Only calculate if service is being monitored
      if (!service.monitoredBy || !service.monitoringSince) {
        return { averageConsultationTime: null, completedCount: 0 };
      }

      // Get completed queues since monitoring started
      const completedQueues = await Queue.find({
        service: serviceId,
        status: "completed",
        servingStartedAt: { $gte: service.monitoringSince },
        servedAt: { $ne: null },
      });

      if (completedQueues.length === 0) {
        return { averageConsultationTime: null, completedCount: 0 };
      }

      // Calculate total consultation time
      let totalConsultationTime = 0;
      completedQueues.forEach((queue) => {
        const consultationDuration =
          (new Date(queue.servedAt) - new Date(queue.servingStartedAt)) /
          (1000 * 60); // Convert to minutes
        totalConsultationTime += consultationDuration;
      });

      const averageConsultationTime =
        totalConsultationTime / completedQueues.length;

      return {
        averageConsultationTime:
          Math.round(averageConsultationTime * 100) / 100, // Round to 2 decimal places
        completedCount: completedQueues.length,
      };
    } catch (error) {
      console.error("Error calculating average consultation time:", error);
      throw error;
    }
  }

  /**
   * Calculate estimated waiting time for all patients in a service queue
   * @param {String} serviceId - The service ID
   * @returns {Array} - Array of { queueId, queueCode, queueNumber, patientName, estimatedWaitingTime, position }
   */
  async getEstimatedWaitingTimes(serviceId) {
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      // Check if service is being monitored
      if (!service.monitoredBy || !service.monitoringSince) {
        return {
          isMonitored: false,
          message: "Service is not currently being monitored",
          waitingTimes: [],
        };
      }

      // Get average consultation time
      const { averageConsultationTime, completedCount } =
        await this.getAverageConsultationTime(serviceId);

      // Get session start time
      const sessionStart = getTodayMidnight();
      const nextSessionStart = new Date(sessionStart);
      nextSessionStart.setHours(nextSessionStart.getHours() + 24);

      // Get all waiting and serving queues
      const queues = await Queue.find({
        service: serviceId,
        date: { $gte: sessionStart, $lt: nextSessionStart },
        status: { $in: ["waiting", "serving"] },
      })
        .populate("patient", "firstName lastName")
        .sort({ queueNumber: 1 });

      if (queues.length === 0) {
        return {
          isMonitored: true,
          averageConsultationTime,
          completedCount,
          waitingTimes: [],
        };
      }

      // If no completed consultations yet, use a default estimate
      const estimatedTimePerPatient = averageConsultationTime || 5; // Default 5 minutes

      const waitingTimes = [];
      let cumulativeWaitTime = 0;
      let position = 1;

      queues.forEach((queue) => {
        const patientName = queue.patient
          ? `${queue.patient.firstName} ${queue.patient.lastName}`
          : "Unknown";

        // If currently serving, they have 0 wait time
        if (queue.status === "serving") {
          waitingTimes.push({
            queueId: queue._id,
            queueCode: queue.queueCode,
            queueNumber: queue.queueNumber,
            patientName,
            estimatedWaitingTime: 0,
            estimatedWaitingTimeFormatted: "Currently being served",
            position: 0,
            status: "serving",
          });
        } else {
          // For waiting patients, calculate based on their position
          const estimatedWait = cumulativeWaitTime + estimatedTimePerPatient;

          waitingTimes.push({
            queueId: queue._id,
            queueCode: queue.queueCode,
            queueNumber: queue.queueNumber,
            patientName,
            estimatedWaitingTime: Math.round(estimatedWait),
            estimatedWaitingTimeFormatted:
              this.formatWaitingTime(estimatedWait),
            position,
            status: "waiting",
          });

          cumulativeWaitTime += estimatedTimePerPatient;
          position++;
        }
      });

      return {
        isMonitored: true,
        averageConsultationTime: estimatedTimePerPatient,
        completedCount,
        serviceName: service.name,
        serviceIdentifier: service.identifier,
        waitingTimes,
      };
    } catch (error) {
      console.error("Error calculating estimated waiting times:", error);
      throw error;
    }
  }

  /**
   * Get estimated waiting time for a specific patient
   * @param {String} queueId - The queue ID
   * @returns {Object} - Estimated waiting time details
   */
  async getPatientWaitingTime(queueId) {
    try {
      const queue = await Queue.findById(queueId).populate("service");

      if (!queue) {
        throw new Error("Queue entry not found");
      }

      if (queue.status === "completed" || queue.status === "cancelled") {
        return {
          message: "Queue is no longer active",
          status: queue.status,
        };
      }

      const serviceId = queue.service._id;
      const estimatedTimes = await this.getEstimatedWaitingTimes(serviceId);

      if (!estimatedTimes.isMonitored) {
        return {
          isMonitored: false,
          message: "Service is not currently being monitored",
        };
      }

      // Find this patient's waiting time
      const patientWaitingTime = estimatedTimes.waitingTimes.find(
        (wt) => wt.queueId.toString() === queueId.toString(),
      );

      if (!patientWaitingTime) {
        return {
          message: "Patient not found in current queue",
        };
      }

      return {
        isMonitored: true,
        queueCode: queue.queueCode,
        queueNumber: queue.queueNumber,
        serviceName: queue.service.name,
        ...patientWaitingTime,
        averageConsultationTime: estimatedTimes.averageConsultationTime,
        completedConsultations: estimatedTimes.completedCount,
      };
    } catch (error) {
      console.error("Error getting patient waiting time:", error);
      throw error;
    }
  }

  /**
   * Format waiting time in a human-readable format
   * @param {Number} minutes - Time in minutes
   * @returns {String} - Formatted time string
   */
  formatWaitingTime(minutes) {
    if (minutes < 1) {
      return "Less than 1 minute";
    } else if (minutes < 60) {
      return `${Math.round(minutes)} minute${Math.round(minutes) !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      }
      return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
    }
  }
}

module.exports = new WaitingTimeService();
