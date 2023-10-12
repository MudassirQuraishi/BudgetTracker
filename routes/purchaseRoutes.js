const express = require("express");
const purchaseController = require("../controllers/purchaseController");
const middleware = require("../middleware/authentication");

const router = express.Router();

/**
 * @route GET /purchase/buy-premium
 * @description Initiate the process to buy a premium membership
 * @access Private (Requires authentication token)
 */
router.get("/buy-premium", middleware.authenticateToken, purchaseController.buyPremium);

/**
 * @route POST /purchase/updateMembership
 * @description Update a user's membership status
 * @access Private (Requires authentication token)
 */
router.post("/updateMembership", middleware.authenticateToken, purchaseController.updateMembership);

/**
 * @route POST /purchase/failed
 * @description Handle a failed purchase attempt
 * @access Private (Requires authentication token)
 */
router.post("/failed", middleware.authenticateToken, purchaseController.failedPurchase);

module.exports = router;
