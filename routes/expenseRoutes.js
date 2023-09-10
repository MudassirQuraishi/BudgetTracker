const express = require("express");
const expenseController = require("../controllers/expenseController");
const middleware = require("../middleware/authentication");

const router = express.Router();

router.post(
  "/add-expense",
  middleware.authenticateToken,
  expenseController.saveDataToDatabase
);

router.delete(
  "/delete-expense/:id",
  middleware.authenticateToken,
  expenseController.deleteFromDatabase
);

router.get(
  "/get-expense",
  middleware.authenticateToken,
  expenseController.getAllDataFromDatabase
);

router.put(
  "/edit-expense/:id",
  middleware.authenticateToken,
  expenseController.editDataInDatabase
);

router.get(
  "/paginatedExpense",
  middleware.authenticateToken,
  expenseController.getPaginatedData
);
router.post(
  "/add-income",
  middleware.authenticateToken,
  expenseController.addIncome
);

module.exports = router;
