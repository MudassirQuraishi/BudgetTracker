const express = require("express");

const resetController = require("../controllers/resetController");

const router = express.Router();

//routes
router.post("/forgotPassword", resetController.forgotPassword);
router.get("/reset-password/:id", resetController.resetPassword);
router.post("/update-password/:id", resetController.updatePassword);

module.exports = router;
