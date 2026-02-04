const Queue = require("../models/queueSchema");
const Service = require("../models/serviceSchema");
const User = require("../models/userSchema");
const ActivityLog = require("../models/activityLogSchema");
const { getTodayMidnight } = require("../utils/dateHelper");

class ReportsService {
  /**
   * Generate comprehensive report for a date range
   */
  async generateReport(startDate, endDate, serviceId = null) {
    try {
      // Ensure dates are at start and end of day
      const reportStart = new Date(startDate);
      reportStart.setHours(0, 0, 0, 0);

      const reportEnd = new Date(endDate);
      reportEnd.setHours(23, 59, 59, 999);

      // Build query
      const queueQuery = {
        createdAt: { $gte: reportStart, $lte: reportEnd },
      };

      if (serviceId) {
        queueQuery.service = serviceId;
      }

      // Fetch all relevant data in parallel
      const [allQueues, services, activityLogs, admins] = await Promise.all([
        Queue.find(queueQuery)
          .populate("service", "name identifier")
          .populate("patient", "firstName lastName priorityStatus")
          .sort({ createdAt: 1 }),
        serviceId ? Service.find({ _id: serviceId }) : Service.find(),
        ActivityLog.find({
          createdAt: { $gte: reportStart, $lte: reportEnd },
          activityType: {
            $in: [
              "monitoring_started",
              "monitoring_stopped",
              "queue_joined",
              "queue_completed",
              "queue_cancelled",
              "queue_skipped",
            ],
          },
        }).populate("performedBy", "firstName lastName userType"),
        User.find({ userType: { $in: ["Admin", "Staff"] } }).select(
          "firstName lastName",
        ),
      ]);

      // Calculate summary statistics
      const summary = this.calculateSummary(allQueues);

      // Calculate service-wise statistics
      const serviceStats = this.calculateServiceStats(allQueues, services);

      // Calculate waiting time analytics
      const waitingTimeAnalytics =
        this.calculateWaitingTimeAnalytics(allQueues);

      // Calculate admin activity
      const adminActivity = this.calculateAdminActivity(activityLogs, admins);

      // Calculate peak hours
      const peakHours = this.calculatePeakHours(allQueues);

      // Calculate daily breakdown
      const dailyBreakdown = this.calculateDailyBreakdown(
        allQueues,
        reportStart,
        reportEnd,
      );

      // Calculate priority status breakdown
      const priorityBreakdown = this.calculatePriorityBreakdown(allQueues);

      return {
        reportMetadata: {
          generatedAt: new Date(),
          startDate: reportStart,
          endDate: reportEnd,
          totalDays:
            Math.ceil((reportEnd - reportStart) / (1000 * 60 * 60 * 24)) + 1,
          serviceFilter: serviceId ? services[0]?.name : "All Services",
        },
        summary,
        serviceStats,
        waitingTimeAnalytics,
        adminActivity,
        peakHours,
        dailyBreakdown,
        priorityBreakdown,
      };
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  }

  /**
   * Calculate summary statistics
   */
  calculateSummary(queues) {
    const completed = queues.filter((q) => q.status === "completed").length;
    const cancelled = queues.filter((q) => q.status === "cancelled").length;
    const skipped = queues.filter((q) => q.status === "skipped").length;
    const waiting = queues.filter((q) => q.status === "waiting").length;
    const serving = queues.filter((q) => q.status === "serving").length;

    return {
      totalQueues: queues.length,
      completed,
      cancelled,
      skipped,
      waiting,
      serving,
      completionRate:
        queues.length > 0 ? ((completed / queues.length) * 100).toFixed(2) : 0,
      cancellationRate:
        queues.length > 0 ? ((cancelled / queues.length) * 100).toFixed(2) : 0,
      skipRate:
        queues.length > 0 ? ((skipped / queues.length) * 100).toFixed(2) : 0,
    };
  }

  /**
   * Calculate service-wise statistics
   */
  calculateServiceStats(queues, services) {
    return services.map((service) => {
      const serviceQueues = queues.filter(
        (q) => q.service && q.service._id.toString() === service._id.toString(),
      );

      const completed = serviceQueues.filter(
        (q) => q.status === "completed",
      ).length;
      const cancelled = serviceQueues.filter(
        (q) => q.status === "cancelled",
      ).length;
      const skipped = serviceQueues.filter(
        (q) => q.status === "skipped",
      ).length;

      // Calculate average waiting time for completed queues with valid timestamps
      const completedWithTimes = serviceQueues.filter(
        (q) => q.status === "completed" && q.servingStartedAt && q.servedAt,
      );

      let avgConsultationTime = 0;
      if (completedWithTimes.length > 0) {
        const totalTime = completedWithTimes.reduce((sum, q) => {
          const duration =
            (new Date(q.servedAt) - new Date(q.servingStartedAt)) / (1000 * 60);
          return sum + duration;
        }, 0);
        avgConsultationTime = totalTime / completedWithTimes.length;
      }

      return {
        serviceId: service._id,
        serviceName: service.name,
        serviceIdentifier: service.identifier,
        totalQueues: serviceQueues.length,
        completed,
        cancelled,
        skipped,
        completionRate:
          serviceQueues.length > 0
            ? ((completed / serviceQueues.length) * 100).toFixed(2)
            : 0,
        avgConsultationTime: avgConsultationTime.toFixed(2),
        totalConsultationTime: (avgConsultationTime * completed).toFixed(2),
      };
    });
  }

  /**
   * Calculate waiting time analytics
   */
  calculateWaitingTimeAnalytics(queues) {
    const completedQueues = queues.filter(
      (q) => q.status === "completed" && q.servingStartedAt && q.servedAt,
    );

    if (completedQueues.length === 0) {
      return {
        totalCompletedConsultations: 0,
        avgConsultationTime: 0,
        minConsultationTime: 0,
        maxConsultationTime: 0,
        totalConsultationTime: 0,
      };
    }

    const consultationTimes = completedQueues.map((q) => {
      return (
        (new Date(q.servedAt) - new Date(q.servingStartedAt)) / (1000 * 60)
      );
    });

    const total = consultationTimes.reduce((sum, time) => sum + time, 0);
    const avg = total / consultationTimes.length;
    const min = Math.min(...consultationTimes);
    const max = Math.max(...consultationTimes);

    return {
      totalCompletedConsultations: completedQueues.length,
      avgConsultationTime: avg.toFixed(2),
      minConsultationTime: min.toFixed(2),
      maxConsultationTime: max.toFixed(2),
      totalConsultationTime: total.toFixed(2),
    };
  }

  /**
   * Calculate admin activity
   */
  calculateAdminActivity(activityLogs, admins) {
    const adminStats = admins.map((admin) => {
      const adminLogs = activityLogs.filter(
        (log) =>
          log.performedBy &&
          log.performedBy._id.toString() === admin._id.toString(),
      );

      const monitoringStarted = adminLogs.filter(
        (log) => log.activityType === "monitoring_started",
      ).length;

      const monitoringStopped = adminLogs.filter(
        (log) => log.activityType === "monitoring_stopped",
      ).length;

      const queuesCompleted = adminLogs.filter(
        (log) => log.activityType === "queue_completed",
      ).length;

      const queuesSkipped = adminLogs.filter(
        (log) => log.activityType === "queue_skipped",
      ).length;

      return {
        adminId: admin._id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        totalActivities: adminLogs.length,
        monitoringSessionsStarted: monitoringStarted,
        monitoringSessionsStopped: monitoringStopped,
        patientsServed: queuesCompleted,
        patientsSkipped: queuesSkipped,
      };
    });

    return adminStats.filter((stat) => stat.totalActivities > 0);
  }

  /**
   * Calculate peak hours
   */
  calculatePeakHours(queues) {
    const hourCounts = new Array(24).fill(0);

    queues.forEach((queue) => {
      const hour = new Date(queue.createdAt).getHours();
      hourCounts[hour]++;
    });

    const peakHourData = hourCounts.map((count, hour) => ({
      hour,
      displayHour: this.formatHour(hour),
      queueCount: count,
    }));

    // Sort by queue count to find peak hours
    const sortedPeaks = [...peakHourData]
      .filter((h) => h.queueCount > 0)
      .sort((a, b) => b.queueCount - a.queueCount);

    return {
      hourlyBreakdown: peakHourData,
      topPeakHours: sortedPeaks.slice(0, 5),
      peakHour: sortedPeaks[0] || null,
    };
  }

  /**
   * Calculate daily breakdown
   */
  calculateDailyBreakdown(queues, startDate, endDate) {
    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayQueues = queues.filter((q) => {
        const queueDate = new Date(q.createdAt);
        return queueDate >= dayStart && queueDate <= dayEnd;
      });

      days.push({
        date: new Date(currentDate),
        dayOfWeek: currentDate.toLocaleDateString("en-US", { weekday: "long" }),
        totalQueues: dayQueues.length,
        completed: dayQueues.filter((q) => q.status === "completed").length,
        cancelled: dayQueues.filter((q) => q.status === "cancelled").length,
        skipped: dayQueues.filter((q) => q.status === "skipped").length,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }

  /**
   * Calculate priority status breakdown
   */
  calculatePriorityBreakdown(queues) {
    const seniorCitizen = queues.filter(
      (q) => q.patient && q.patient.priorityStatus === "Senior Citizen",
    ).length;

    const pwd = queues.filter(
      (q) => q.patient && q.patient.priorityStatus === "PWD",
    ).length;

    const regular = queues.filter(
      (q) =>
        q.patient &&
        (!q.patient.priorityStatus || q.patient.priorityStatus === "None"),
    ).length;

    return {
      seniorCitizen,
      pwd,
      regular,
      total: queues.length,
      seniorCitizenPercentage:
        queues.length > 0
          ? ((seniorCitizen / queues.length) * 100).toFixed(2)
          : 0,
      pwdPercentage:
        queues.length > 0 ? ((pwd / queues.length) * 100).toFixed(2) : 0,
      regularPercentage:
        queues.length > 0 ? ((regular / queues.length) * 100).toFixed(2) : 0,
    };
  }

  /**
   * Format hour for display
   */
  formatHour(hour) {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  }

  /**
   * Get predefined date ranges
   */
  getDateRange(period) {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case "today":
        startDate = getTodayMidnight();
        endDate = new Date(now);
        break;

      case "yesterday":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;

      case "week":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;

      case "month":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        throw new Error("Invalid period");
    }

    return { startDate, endDate };
  }
}

module.exports = new ReportsService();
