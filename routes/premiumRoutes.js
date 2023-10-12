const express = require("express");
const premiumController = require("../controllers/premiumController");
const reportController = require("../controllers/reportController");
const middleware = require("../middleware/authentication");

const router = express.Router();

/**
 * @route GET /premium/showLeaderboard
 * @description Display the user leaderboard
 * @access Private (Requires authentication token)
 */
router.get("/showLeaderboard", middleware.authenticateToken, premiumController.showLeaderboard);

/**
 * @route GET /premium/downloadReport
 * @description Download a report
 * @access Private (Requires authentication token)
 */
router.get("/downloadReport", middleware.authenticateToken, reportController.downloadReport);

/**
 * @route GET /premium/get-previous-reports
 * @description Display previous reports
 * @access Private (Requires authentication token)
 */
router.get("/get-previous-reports", middleware.authenticateToken, reportController.showReports);

/**
 * @route GET /premium/dashboard
 * @description Display the user's dashboard
 * @access Private (Requires authentication token)
 */
router.get("/dashboard", middleware.authenticateToken, premiumController.showDashboard);

module.exports = router;
