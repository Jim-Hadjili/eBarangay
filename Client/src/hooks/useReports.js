import { useState } from "react";
import { getToken } from "../utils/session";

const API_URL = import.meta.env.VITE_API_URL;

export default function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async (reportConfig) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      let url = "";
      const params = new URLSearchParams();

      if (reportConfig.reportType === "period") {
        // Predefined period report
        url = `${API_URL}/reports/period`;
        params.append("period", reportConfig.period);
        if (reportConfig.serviceId) {
          params.append("serviceId", reportConfig.serviceId);
        }
      } else if (reportConfig.reportType === "custom") {
        // Custom date range report
        url = `${API_URL}/reports/generate`;
        params.append("startDate", reportConfig.startDate);
        params.append("endDate", reportConfig.endDate);
        if (reportConfig.serviceId) {
          params.append("serviceId", reportConfig.serviceId);
        }
      }

      const response = await fetch(`${url}?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate report");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportReportHTML = async (reportConfig) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const params = new URLSearchParams();

      if (reportConfig.reportType === "period") {
        const { startDate, endDate } = getDateRangeFromPeriod(
          reportConfig.period,
        );
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      } else {
        params.append("startDate", reportConfig.startDate);
        params.append("endDate", reportConfig.endDate);
      }

      if (reportConfig.serviceId) {
        params.append("serviceId", reportConfig.serviceId);
      }

      const url = `${API_URL}/reports/export/html?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export report");
      }

      const html = await response.text();

      // Open in new window for printing
      const printWindow = window.open("", "_blank");
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadReportHTML = async (reportConfig) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const params = new URLSearchParams();

      if (reportConfig.reportType === "period") {
        const { startDate, endDate } = getDateRangeFromPeriod(
          reportConfig.period,
        );
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      } else {
        params.append("startDate", reportConfig.startDate);
        params.append("endDate", reportConfig.endDate);
      }

      if (reportConfig.serviceId) {
        params.append("serviceId", reportConfig.serviceId);
      }

      const url = `${API_URL}/reports/export/html?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      const html = await response.text();

      // Create blob and download
      const blob = new Blob([html], { type: "text/html" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Create filename
      const startDate = reportConfig.startDate || "report";
      const endDate = reportConfig.endDate || "";
      link.download = `eBarangay-Report-${startDate}-${endDate}.html`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateReport,
    exportReportHTML,
    downloadReportHTML,
    loading,
    error,
  };
}

// Helper function to get date range from period
function getDateRangeFromPeriod(period) {
  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0))
        .toISOString()
        .split("T")[0];
      endDate = new Date(now.setHours(23, 59, 59, 999))
        .toISOString()
        .split("T")[0];
      break;
    case "yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = new Date(yesterday.setHours(0, 0, 0, 0))
        .toISOString()
        .split("T")[0];
      endDate = new Date(yesterday.setHours(23, 59, 59, 999))
        .toISOString()
        .split("T")[0];
      break;
    case "week":
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      startDate = weekAgo.toISOString().split("T")[0];
      endDate = now.toISOString().split("T")[0];
      break;
    case "month":
      const monthAgo = new Date(now);
      monthAgo.setDate(monthAgo.getDate() - 30);
      startDate = monthAgo.toISOString().split("T")[0];
      endDate = now.toISOString().split("T")[0];
      break;
    default:
      startDate = now.toISOString().split("T")[0];
      endDate = now.toISOString().split("T")[0];
  }

  return { startDate, endDate };
}
