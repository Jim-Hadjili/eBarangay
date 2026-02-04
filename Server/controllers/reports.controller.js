const ReportsService = require("../services/reports.service");
const ActivityLogger = require("../utils/activityLogger");

/**
 * Generate report for a specific date range
 */
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, serviceId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required",
      });
    }

    const report = await ReportsService.generateReport(
      new Date(startDate),
      new Date(endDate),
      serviceId || null,
    );

    // Log activity
    await ActivityLogger.log({
      activityType: "report_generated",
      description: `Report generated from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
      performedBy: req.user?.id || null,
      metadata: {
        startDate,
        endDate,
        serviceId: serviceId || "all",
      },
    });

    res.json(report);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Generate report for predefined periods (today, week, month)
 */
exports.generatePeriodReport = async (req, res) => {
  try {
    const { period, serviceId } = req.query;

    if (!period) {
      return res.status(400).json({
        message: "Period is required (today, yesterday, week, month)",
      });
    }

    const { startDate, endDate } = ReportsService.getDateRange(period);

    const report = await ReportsService.generateReport(
      startDate,
      endDate,
      serviceId || null,
    );

    // Log activity
    await ActivityLogger.log({
      activityType: "report_generated",
      description: `${period.charAt(0).toUpperCase() + period.slice(1)} report generated`,
      performedBy: req.user?.id || null,
      metadata: {
        period,
        serviceId: serviceId || "all",
      },
    });

    res.json(report);
  } catch (err) {
    console.error("Error generating period report:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Get report summary (quick stats without full details)
 */
exports.getReportSummary = async (req, res) => {
  try {
    const { startDate, endDate, serviceId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required",
      });
    }

    const report = await ReportsService.generateReport(
      new Date(startDate),
      new Date(endDate),
      serviceId || null,
    );

    // Return only summary data
    res.json({
      reportMetadata: report.reportMetadata,
      summary: report.summary,
      serviceStats: report.serviceStats,
      waitingTimeAnalytics: report.waitingTimeAnalytics,
    });
  } catch (err) {
    console.error("Error generating report summary:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Export report as print-friendly HTML
 */
exports.exportReportHTML = async (req, res) => {
  try {
    const { startDate, endDate, serviceId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required",
      });
    }

    const report = await ReportsService.generateReport(
      new Date(startDate),
      new Date(endDate),
      serviceId || null,
    );

    // Generate print-friendly HTML
    const html = generatePrintableHTML(report);

    // Log activity
    await ActivityLogger.log({
      activityType: "report_exported",
      description: `Report exported for printing from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
      performedBy: req.user?.id || null,
      metadata: {
        startDate,
        endDate,
        serviceId: serviceId || "all",
        format: "html",
      },
    });

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error("Error exporting report:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Generate print-friendly HTML
 */
function generatePrintableHTML(report) {
  const {
    reportMetadata,
    summary,
    serviceStats,
    waitingTimeAnalytics,
    adminActivity,
    peakHours,
    dailyBreakdown,
    priorityBreakdown,
  } = report;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Healthcare Queue Report - ${new Date(reportMetadata.startDate).toLocaleDateString()} to ${new Date(reportMetadata.endDate).toLocaleDateString()}</title>
  <style>
    @media print {
      @page {
        size: A4;
        margin: 20mm;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page-break {
        page-break-before: always;
      }
      .no-break {
        page-break-inside: avoid;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .report-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }

    .report-title {
      font-size: 28px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 10px;
    }

    .report-subtitle {
      font-size: 16px;
      color: #64748b;
      margin-bottom: 5px;
    }

    .report-meta {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      padding: 15px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .report-meta-item {
      text-align: center;
    }

    .report-meta-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }

    .report-meta-value {
      font-size: 16px;
      font-weight: bold;
      color: #1e293b;
    }

    .section {
      margin: 30px 0;
      padding: 20px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #3b82f6;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }

    .stat-card {
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-card.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .stat-card.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .stat-card.danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .stat-card.info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .stat-label {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: bold;
    }

    .stat-subtitle {
      font-size: 11px;
      opacity: 0.8;
      margin-top: 5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      background: white;
    }

    th {
      background: #1e40af;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }

    tr:hover {
      background: #f8fafc;
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
    }

    .badge-info {
      background: #dbeafe;
      color: #1e40af;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #94a3b8;
      font-style: italic;
    }

    .highlight-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }

    .info-box {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }

    @media print {
      .stat-card {
        break-inside: avoid;
      }
      table {
        break-inside: avoid;
      }
      .section {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="report-header">
    <div class="report-title">Healthcare Queue System Report</div>
    <div class="report-subtitle">eBarangay Health Services</div>
    <div class="report-subtitle">Report Period: ${new Date(reportMetadata.startDate).toLocaleDateString()} - ${new Date(reportMetadata.endDate).toLocaleDateString()}</div>
  </div>

  <!-- Metadata -->
  <div class="report-meta">
    <div class="report-meta-item">
      <div class="report-meta-label">Generated On</div>
      <div class="report-meta-value">${new Date(reportMetadata.generatedAt).toLocaleString()}</div>
    </div>
    <div class="report-meta-item">
      <div class="report-meta-label">Report Duration</div>
      <div class="report-meta-value">${reportMetadata.totalDays} Day${reportMetadata.totalDays !== 1 ? "s" : ""}</div>
    </div>
    <div class="report-meta-item">
      <div class="report-meta-label">Service Filter</div>
      <div class="report-meta-value">${reportMetadata.serviceFilter}</div>
    </div>
  </div>

  <!-- Executive Summary -->
  <div class="section no-break">
    <h2 class="section-title">📊 Executive Summary</h2>
    <div class="stats-grid">
      <div class="stat-card info">
        <div class="stat-label">Total Queues</div>
        <div class="stat-value">${summary.totalQueues}</div>
        <div class="stat-subtitle">All queue entries</div>
      </div>
      <div class="stat-card success">
        <div class="stat-label">Completed</div>
        <div class="stat-value">${summary.completed}</div>
        <div class="stat-subtitle">${summary.completionRate}% completion rate</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-label">Cancelled</div>
        <div class="stat-value">${summary.cancelled}</div>
        <div class="stat-subtitle">${summary.cancellationRate}% cancellation rate</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-label">Skipped</div>
        <div class="stat-value">${summary.skipped}</div>
        <div class="stat-subtitle">${summary.skipRate}% skip rate</div>
      </div>
    </div>
  </div>

  <!-- Service-Wise Statistics -->
  <div class="section no-break">
    <h2 class="section-title">🏥 Service-Wise Statistics</h2>
    ${
      serviceStats.length > 0
        ? `
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Total</th>
            <th>Completed</th>
            <th>Cancelled</th>
            <th>Skipped</th>
            <th>Completion Rate</th>
            <th>Avg Consult Time</th>
          </tr>
        </thead>
        <tbody>
          ${serviceStats
            .map(
              (stat) => `
            <tr>
              <td><strong>${stat.serviceName}</strong><br/><small>${stat.serviceIdentifier}</small></td>
              <td>${stat.totalQueues}</td>
              <td><span class="badge badge-success">${stat.completed}</span></td>
              <td><span class="badge badge-warning">${stat.cancelled}</span></td>
              <td><span class="badge badge-danger">${stat.skipped}</span></td>
              <td><strong>${stat.completionRate}%</strong></td>
              <td>${stat.avgConsultationTime} min</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `
        : '<div class="no-data">No service data available for this period</div>'
    }
  </div>

  <!-- Waiting Time Analytics -->
  <div class="section no-break page-break">
    <h2 class="section-title">⏱️ Consultation Time Analytics</h2>
    <div class="stats-grid">
      <div class="stat-card info">
        <div class="stat-label">Completed Consultations</div>
        <div class="stat-value">${waitingTimeAnalytics.totalCompletedConsultations}</div>
      </div>
      <div class="stat-card success">
        <div class="stat-label">Average Time</div>
        <div class="stat-value">${waitingTimeAnalytics.avgConsultationTime} min</div>
      </div>
      <div class="stat-card info">
        <div class="stat-label">Fastest</div>
        <div class="stat-value">${waitingTimeAnalytics.minConsultationTime} min</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-label">Longest</div>
        <div class="stat-value">${waitingTimeAnalytics.maxConsultationTime} min</div>
      </div>
    </div>
    <div class="info-box">
      <strong>Total Consultation Time:</strong> ${waitingTimeAnalytics.totalConsultationTime} minutes (${(waitingTimeAnalytics.totalConsultationTime / 60).toFixed(2)} hours)
    </div>
  </div>

  <!-- Priority Status Breakdown -->
  <div class="section no-break">
    <h2 class="section-title">👥 Patient Priority Status</h2>
    <div class="stats-grid">
      <div class="stat-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
        <div class="stat-label">Senior Citizens</div>
        <div class="stat-value">${priorityBreakdown.seniorCitizen}</div>
        <div class="stat-subtitle">${priorityBreakdown.seniorCitizenPercentage}% of total</div>
      </div>
      <div class="stat-card" style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);">
        <div class="stat-label">PWD</div>
        <div class="stat-value">${priorityBreakdown.pwd}</div>
        <div class="stat-subtitle">${priorityBreakdown.pwdPercentage}% of total</div>
      </div>
      <div class="stat-card" style="background: linear-gradient(135deg, #64748b 0%, #475569 100%);">
        <div class="stat-label">Regular</div>
        <div class="stat-value">${priorityBreakdown.regular}</div>
        <div class="stat-subtitle">${priorityBreakdown.regularPercentage}% of total</div>
      </div>
    </div>
  </div>

  <!-- Admin Activity -->
  ${
    adminActivity.length > 0
      ? `
    <div class="section no-break page-break">
      <h2 class="section-title">👨‍⚕️ Admin Activity Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Admin Name</th>
            <th>Total Activities</th>
            <th>Sessions Started</th>
            <th>Sessions Stopped</th>
            <th>Patients Served</th>
            <th>Patients Skipped</th>
          </tr>
        </thead>
        <tbody>
          ${adminActivity
            .map(
              (admin) => `
            <tr>
              <td><strong>${admin.adminName}</strong></td>
              <td>${admin.totalActivities}</td>
              <td>${admin.monitoringSessionsStarted}</td>
              <td>${admin.monitoringSessionsStopped}</td>
              <td><span class="badge badge-success">${admin.patientsServed}</span></td>
              <td><span class="badge badge-warning">${admin.patientsSkipped}</span></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
      : ""
  }

  <!-- Peak Hours -->
  ${
    peakHours.topPeakHours.length > 0
      ? `
    <div class="section no-break">
      <h2 class="section-title">📈 Peak Hours Analysis</h2>
      ${
        peakHours.peakHour
          ? `
        <div class="highlight-box">
          <strong>Peak Hour:</strong> ${peakHours.peakHour.displayHour} with ${peakHours.peakHour.queueCount} queue entries
        </div>
      `
          : ""
      }
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Hour</th>
            <th>Queue Entries</th>
            <th>Visual</th>
          </tr>
        </thead>
        <tbody>
          ${peakHours.topPeakHours
            .map(
              (peak, index) => `
            <tr>
              <td><strong>#${index + 1}</strong></td>
              <td>${peak.displayHour}</td>
              <td>${peak.queueCount}</td>
              <td>
                <div style="background: #3b82f6; height: 20px; width: ${(peak.queueCount / peakHours.peakHour.queueCount) * 100}%; border-radius: 4px;"></div>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
      : ""
  }

  <!-- Daily Breakdown -->
  ${
    dailyBreakdown.length > 0
      ? `
    <div class="section no-break page-break">
      <h2 class="section-title">📅 Daily Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>Total</th>
            <th>Completed</th>
            <th>Cancelled</th>
            <th>Skipped</th>
          </tr>
        </thead>
        <tbody>
          ${dailyBreakdown
            .map(
              (day) => `
            <tr>
              <td><strong>${new Date(day.date).toLocaleDateString()}</strong></td>
              <td>${day.dayOfWeek}</td>
              <td>${day.totalQueues}</td>
              <td><span class="badge badge-success">${day.completed}</span></td>
              <td><span class="badge badge-warning">${day.cancelled}</span></td>
              <td><span class="badge badge-danger">${day.skipped}</span></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
      : ""
  }

  <!-- Footer -->
  <div class="footer">
    <p><strong>eBarangay Healthcare Queue Management System</strong></p>
    <p>Generated on: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
  `;
}

module.exports = {
  generateReport: exports.generateReport,
  generatePeriodReport: exports.generatePeriodReport,
  getReportSummary: exports.getReportSummary,
  exportReportHTML: exports.exportReportHTML,
};
