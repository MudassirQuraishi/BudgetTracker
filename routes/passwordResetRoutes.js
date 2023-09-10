const express = require("express");

const resetController = require("../controllers/resetController");

const router = express.Router();

router.post("/forgotPassword", resetController.forgotPassword);
router.get("/reset-password/:id", resetController.resetPassword);
router.get("/update-password/:id", resetController.updatePassword);

module.exports = router;
