const express = require("express");

const purcahseController = require("../controllers/purchaseController");
const middleware = require("../middleware/authentication");

const router = express.Router();

router.get(
  "/buy-premium",
  middleware.authenticateToken,
  purcahseController.buyPremium
);

router.post(
  "/updateMembership",
  middleware.authenticateToken,
  purcahseController.updateMembership
);

router.post(
  "/failed",
  middleware.authenticateToken,
  purcahseController.failedPurchase
);

module.exports = router;
