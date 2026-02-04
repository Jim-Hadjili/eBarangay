const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @route   GET /api/reports/generate
 * @desc    Generate comprehensive report for custom date range
 * @access  Private (Admin only)
 * @query   startDate (required), endDate (required), serviceId (optional)
 */
router.get("/generate", authMiddleware, reportsController.generateReport);

/**
 * @route   GET /api/reports/period
 * @desc    Generate report for predefined period (today, yesterday, week, month)
 * @access  Private (Admin only)
 * @query   period (required: today|yesterday|week|month), serviceId (optional)
 */
router.get("/period", authMiddleware, reportsController.generatePeriodReport);

/**
 * @route   GET /api/reports/summary
 * @desc    Get quick report summary without full details
 * @access  Private (Admin only)
 * @query   startDate (required), endDate (required), serviceId (optional)
 */
router.get("/summary", authMiddleware, reportsController.getReportSummary);

/**
 * @route   GET /api/reports/export/html
 * @desc    Export report as print-friendly HTML
 * @access  Private (Admin only)
 * @query   startDate (required), endDate (required), serviceId (optional)
 */
router.get("/export/html", authMiddleware, reportsController.exportReportHTML);

module.exports = router;
