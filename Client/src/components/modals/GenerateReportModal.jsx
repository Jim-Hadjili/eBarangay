import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCalendarDays,
  faCalendarWeek,
  faCalendarDay,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import useReports from "../../hooks/useReports";
import { getToken } from "../../utils/session";

const API_URL = import.meta.env.VITE_API_URL;

export default function GenerateReportModal({ isOpen, onClose }) {
  const [reportType, setReportType] = useState("period");
  const [period, setPeriod] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [exportFormat, setExportFormat] = useState("print");

  const {
    generateReport,
    exportReportHTML,
    downloadReportHTML,
    loading,
    error,
  } = useReports();

  // Fetch services on mount
  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both array and object response structures
        setServices(Array.isArray(data) ? data : data.services || []);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const reportConfig = {
        reportType,
        period: reportType === "period" ? period : undefined,
        startDate: reportType === "custom" ? startDate : undefined,
        endDate: reportType === "custom" ? endDate : undefined,
        serviceId: serviceId || undefined,
      };

      if (exportFormat === "print") {
        // Export as printable HTML (opens in new window)
        await exportReportHTML(reportConfig);
        onClose();
      } else if (exportFormat === "download") {
        // Download HTML file
        await downloadReportHTML(reportConfig);
        onClose();
      }
    } catch (err) {
      console.error("Error generating report:", err);
    }
  };

  const isValidConfig = () => {
    if (reportType === "custom") {
      return startDate && endDate && new Date(startDate) <= new Date(endDate);
    }
    return true;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="flex flex-col w-full gap-4">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <FontAwesomeIcon
              icon={faChartBar}
              className="text-2xl text-blue-600"
            />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Generate Report
          </h2>
          <p className="text-gray-600">
            Select report parameters to generate comprehensive statistics
          </p>
        </div>

        {/* Report Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Report Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setReportType("period")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                reportType === "period"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FontAwesomeIcon icon={faCalendarDay} />
              <span className="font-medium">Predefined Period</span>
            </button>
            <button
              onClick={() => setReportType("custom")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                reportType === "custom"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FontAwesomeIcon icon={faCalendarWeek} />
              <span className="font-medium">Custom Date Range</span>
            </button>
          </div>
        </div>

        {/* Period Selection (if predefined) */}
        {reportType === "period" && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Select Period
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["today", "yesterday", "week", "month"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                    period === p
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {p === "week"
                    ? "Last 7 Days"
                    : p === "month"
                      ? "Last 30 Days"
                      : p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Date Range (if custom) */}
        {reportType === "custom" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                min={startDate}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Service Filter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Filter by Service (Optional)
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            disabled={loadingServices}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Services</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Export Format */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setExportFormat("print")}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                exportFormat === "print"
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              Print/PDF
            </button>
            <button
              onClick={() => setExportFormat("download")}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                exportFormat === "download"
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              Download
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !isValidConfig()}
            className="flex items-center justify-center flex-1 gap-2 px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
