const express = require("express");

// Import the user controller that handles user-related operations
const userController = require("../controllers/loginController");

const router = express.Router();

/**
 * @route POST /user/signup
 * @description Register a new user
 * @access Public
 */
router.post("/signup", userController.signup);

/**
 * @route POST /user/login
 * @description Authenticate a user and generate a token
 * @access Public
 */
router.post("/login", userController.login);

module.exports = router;
