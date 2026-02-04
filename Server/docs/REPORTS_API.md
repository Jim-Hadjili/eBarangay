# Healthcare Queue Reports API Documentation

## Overview

The Reports API provides comprehensive analytics and reporting capabilities for the healthcare queue management system. It generates detailed reports with statistics on queue operations, service performance, admin activity, and patient patterns.

## Features

✅ **Multiple Report Periods**

- Today's report
- Yesterday's report
- Last 7 days (week)
- Last 30 days (month)
- Custom date range

✅ **Comprehensive Statistics**

- Total queues served, cancelled, skipped
- Service-wise performance metrics
- Average consultation times
- Admin activity tracking
- Peak hours analysis
- Daily breakdown
- Priority status breakdown (Senior Citizens, PWD, Regular)

✅ **Print-Friendly Output**

- Professional HTML format
- Optimized for A4 printing
- PDF-ready layout
- Clean page breaks
- Consistent formatting

---

## API Endpoints

### 1. Generate Custom Date Range Report

**Endpoint:** `GET /api/reports/generate`

**Description:** Generate a comprehensive report for a custom date range

**Access:** Private (Admin only)

**Query Parameters:**

- `startDate` (required) - Start date in ISO format (YYYY-MM-DD)
- `endDate` (required) - End date in ISO format (YYYY-MM-DD)
- `serviceId` (optional) - Filter by specific service ID

**Example Request:**

```bash
GET /api/reports/generate?startDate=2026-01-01&endDate=2026-01-31&serviceId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response:**

```json
{
  "reportMetadata": {
    "generatedAt": "2026-02-04T10:30:00.000Z",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-01-31T23:59:59.999Z",
    "totalDays": 31,
    "serviceFilter": "Vaccination"
  },
  "summary": {
    "totalQueues": 450,
    "completed": 380,
    "cancelled": 50,
    "skipped": 20,
    "waiting": 0,
    "serving": 0,
    "completionRate": "84.44",
    "cancellationRate": "11.11",
    "skipRate": "4.44"
  },
  "serviceStats": [
    {
      "serviceId": "507f1f77bcf86cd799439011",
      "serviceName": "Vaccination",
      "serviceIdentifier": "VAC",
      "totalQueues": 450,
      "completed": 380,
      "cancelled": 50,
      "skipped": 20,
      "completionRate": "84.44",
      "avgConsultationTime": "6.50",
      "totalConsultationTime": "2470.00"
    }
  ],
  "waitingTimeAnalytics": {
    "totalCompletedConsultations": 380,
    "avgConsultationTime": "6.50",
    "minConsultationTime": "3.20",
    "maxConsultationTime": "15.80",
    "totalConsultationTime": "2470.00"
  },
  "adminActivity": [
    {
      "adminId": "507f1f77bcf86cd799439012",
      "adminName": "John Admin",
      "totalActivities": 120,
      "monitoringSessionsStarted": 25,
      "monitoringSessionsStopped": 25,
      "patientsServed": 150,
      "patientsSkipped": 8
    }
  ],
  "peakHours": {
    "hourlyBreakdown": [...],
    "topPeakHours": [
      {
        "hour": 9,
        "displayHour": "9:00 AM",
        "queueCount": 45
      },
      {
        "hour": 14,
        "displayHour": "2:00 PM",
        "queueCount": 38
      }
    ],
    "peakHour": {
      "hour": 9,
      "displayHour": "9:00 AM",
      "queueCount": 45
    }
  },
  "dailyBreakdown": [
    {
      "date": "2026-01-01T00:00:00.000Z",
      "dayOfWeek": "Wednesday",
      "totalQueues": 15,
      "completed": 12,
      "cancelled": 2,
      "skipped": 1
    }
  ],
  "priorityBreakdown": {
    "seniorCitizen": 120,
    "pwd": 80,
    "regular": 250,
    "total": 450,
    "seniorCitizenPercentage": "26.67",
    "pwdPercentage": "17.78",
    "regularPercentage": "55.56"
  }
}
```

---

### 2. Generate Period Report

**Endpoint:** `GET /api/reports/period`

**Description:** Generate report for predefined periods

**Access:** Private (Admin only)

**Query Parameters:**

- `period` (required) - One of: `today`, `yesterday`, `week`, `month`
- `serviceId` (optional) - Filter by specific service ID

**Example Request:**

```bash
GET /api/reports/period?period=week&serviceId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

**Response:** Same structure as custom date range report

---

### 3. Get Report Summary

**Endpoint:** `GET /api/reports/summary`

**Description:** Get quick summary statistics without full details

**Access:** Private (Admin only)

**Query Parameters:**

- `startDate` (required) - Start date in ISO format
- `endDate` (required) - End date in ISO format
- `serviceId` (optional) - Filter by specific service ID

**Example Request:**

```bash
GET /api/reports/summary?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

**Response:**

```json
{
  "reportMetadata": {...},
  "summary": {...},
  "serviceStats": [...],
  "waitingTimeAnalytics": {...}
}
```

---

### 4. Export Report as HTML

**Endpoint:** `GET /api/reports/export/html`

**Description:** Export report as print-friendly HTML document

**Access:** Private (Admin only)

**Query Parameters:**

- `startDate` (required) - Start date in ISO format
- `endDate` (required) - End date in ISO format
- `serviceId` (optional) - Filter by specific service ID

**Example Request:**

```bash
GET /api/reports/export/html?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

**Response:** HTML document (Content-Type: text/html)

---

## Report Components

### 1. Executive Summary

- Total queues
- Completed queues
- Cancelled queues
- Skipped queues
- Completion, cancellation, and skip rates

### 2. Service-Wise Statistics

- Per-service queue counts
- Completion rates by service
- Average consultation times
- Total consultation time per service

### 3. Consultation Time Analytics

- Average consultation time across all services
- Minimum consultation time
- Maximum consultation time
- Total consultation hours

### 4. Patient Priority Status

- Senior Citizens count and percentage
- PWD count and percentage
- Regular patients count and percentage

### 5. Admin Activity Summary

- Monitoring sessions managed
- Patients served per admin
- Patients skipped per admin
- Total activities logged

### 6. Peak Hours Analysis

- Hour-by-hour queue volume
- Top 5 busiest hours
- Visual representation of peak times

### 7. Daily Breakdown

- Day-by-day statistics
- Queue status breakdown per day
- Day of week patterns

---

## Use Cases

### 1. Daily Operations Report

```bash
GET /api/reports/period?period=today
```

View today's statistics for monitoring current operations.

### 2. Weekly Performance Review

```bash
GET /api/reports/period?period=week
```

Analyze the past week's performance for weekly meetings.

### 3. Monthly Service Analysis

```bash
GET /api/reports/generate?startDate=2026-01-01&endDate=2026-01-31&serviceId=<id>
```

Detailed analysis of a specific service's performance.

### 4. Print Report for Management

```bash
GET /api/reports/export/html?startDate=2026-01-01&endDate=2026-01-31
```

Generate printable report for management review or auditing.

---

## Print-Friendly HTML Features

The HTML export includes:

✅ **Professional Layout**

- Clean, modern design
- Color-coded statistics
- Gradient stat cards
- Professional tables

✅ **Print Optimization**

- A4 page size
- Proper margins (20mm)
- Page break controls
- No broken tables across pages
- Print color preservation

✅ **Formatting**

- Clear section headings
- Visual hierarchy
- Badges for status indicators
- Progress bars for comparisons
- Responsive grid layouts

✅ **Content Structure**

- Report header with title and metadata
- Executive summary
- Detailed sections
- Visual data representation
- Footer with generation timestamp

---

## Client Integration Example

### Fetch Report Data

```javascript
async function generateReport(startDate, endDate, serviceId = null) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  if (serviceId) {
    params.append("serviceId", serviceId);
  }

  const response = await fetch(`${API_URL}/reports/generate?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}
```

### Open Printable Report

```javascript
function openPrintableReport(startDate, endDate) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  const url = `${API_URL}/reports/export/html?${params}`;

  // Open in new window
  const printWindow = window.open(url, "_blank");

  // Or download as file
  fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.text())
    .then((html) => {
      const blob = new Blob([html], { type: "text/html" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `report-${startDate}-${endDate}.html`;
      link.click();
    });
}
```

### Export to PDF (Client-Side)

```javascript
async function exportToPDF(startDate, endDate) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({
    startDate,
    endDate,
  });

  const response = await fetch(`${API_URL}/reports/export/html?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const html = await response.text();

  // Use browser's print to PDF
  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print(); // User can select "Save as PDF"
}
```

---

## Error Handling

### Missing Parameters

```json
{
  "message": "Start date and end date are required"
}
```

### Invalid Period

```json
{
  "message": "Invalid period"
}
```

### Server Error

```json
{
  "message": "Server error",
  "error": "Error details"
}
```

---

## Activity Logging

All report generation activities are logged:

- Report type (custom/period/summary/export)
- Date range
- Service filter (if any)
- Generated by (admin user)
- Timestamp

---

## Performance Considerations

- Reports are generated on-demand (not cached)
- Large date ranges may take longer to process
- Consider pagination for very large datasets
- HTML export includes all data (no pagination)

---

## Best Practices

1. **Regular Reporting**
   - Generate daily reports at end of day
   - Weekly reports for management review
   - Monthly reports for trend analysis

2. **Service-Specific Analysis**
   - Filter by service for detailed analysis
   - Compare services side-by-side

3. **Print and Archive**
   - Export HTML for official records
   - Save as PDF for archival purposes
   - Print for physical documentation

4. **Data-Driven Decisions**
   - Use peak hours data for staffing
   - Monitor completion rates for efficiency
   - Track admin performance metrics

---

## Future Enhancements

Potential improvements:

- CSV export format
- Excel export with charts
- Scheduled report generation
- Email report delivery
- Custom report templates
- Year-over-year comparisons
- Predictive analytics
