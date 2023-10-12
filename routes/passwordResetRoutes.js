const express = require("express");
const resetController = require("../controllers/resetController");

const router = express.Router();

/**
 * @route POST /password/forgotPassword
 * @description Request a password reset for a user
 * @access Public
 */
router.post("/forgotPassword", resetController.forgotPassword);

/**
 * @route GET /password/reset-password/:id
 * @description Display a password reset form for a user
 * @access Public
 */
router.get("/reset-password/:id", resetController.resetPassword);

/**
 * @route POST /password/update-password/:id
 * @description Update a user's password after a reset
 * @access Public
 */
router.post("/update-password/:id", resetController.updatePassword);

module.exports = router;
