const express = require("express");
const premiumController = require("../controllers/premiumController");
const reportController = require("../controllers/reportController");
const middleware = require("../middleware/authentication");

const router = express.Router();

router.get(
  "/showLeaderboard",
  middleware.authenticateToken,
  premiumController.showLeaderboard
);
router.get(
  "/downloadReport",
  middleware.authenticateToken,
  reportController.downloadReport
);
router.get(
  "/get-previous-reports",
  middleware.authenticateToken,
  reportController.showReports
);
router.get(
  "/dashboard",
  middleware.authenticateToken,
  premiumController.showDashboard
);

module.exports = router;
