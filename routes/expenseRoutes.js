const express = require("express");
const expenseController = require("../controllers/expenseController");
const middleware = require("../middleware/authentication");

const router = express.Router();

/**
 * @route POST /expense/add-expense
 * @description Add an expense to the database
 * @access Private (Requires authentication token)
 */
router.post("/add-expense", middleware.authenticateToken, expenseController.saveDataToDatabase);

/**
 * @route DELETE /expense/delete-expense/:id
 * @description Delete an expense from the database by ID
 * @access Private (Requires authentication token)
 */
router.delete("/delete-expense/:id", middleware.authenticateToken, expenseController.deleteFromDatabase);

/**
 * @route GET /expense/get-expense
 * @description Get all expenses from the database
 * @access Private (Requires authentication token)
 */
router.get("/get-expense", middleware.authenticateToken, expenseController.getAllDataFromDatabase);

/**
 * @route PUT /expense/edit-expense/:id
 * @description Edit an expense in the database by ID
 * @access Private (Requires authentication token)
 */
router.put("/edit-expense/:id", middleware.authenticateToken, expenseController.editDataInDatabase);

/**
 * @route GET /expense/paginatedExpense
 * @description Get paginated expenses from the database
 * @access Private (Requires authentication token)
 */
router.get("/paginatedExpense", middleware.authenticateToken, expenseController.getPaginatedData);

/**
 * @route POST /expense/add-income
 * @description Add income to the database
 * @access Private (Requires authentication token)
 */
router.post("/add-income", middleware.authenticateToken, expenseController.addIncome);

module.exports = router;
