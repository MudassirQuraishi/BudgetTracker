// Importing models and libraries
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

/**
 * Middleware to save an expense to the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.saveDataToDatabase = async (req, res) => {
	try {
		const { _id } = req.user;
		const { description, amount, category } = req.body;

		// Create the expense document using Expense.create
		const savedExpense = await Expense.create({
			description: description,
			price: amount,
			category: category,
			user: _id,
		});

		res.status(201).json({ success: true, message: "Successfully added Expense", data: savedExpense });
	} catch (error) {
		console.error("Error in saving expense:", error);
		res.status(500).json({ success: false, message: "Error Adding Expense To The Database" });
	}
};

/**
 * Middleware to delete an expense from the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.deleteFromDatabase = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { id } = req.params;

		// Find the expense by ID to get its price
		const expense = await Expense.findById(id);

		if (!expense) {
			session.endSession();
			return res.status(404).json({ success: false, message: "Expense not found" });
		}

		// Get the price from the found expense
		const price = expense.price;

		// Delete the expense document
		await Expense.findByIdAndDelete(id, { session });

		// Update the user's totalExpense field by subtracting the price
		await User.updateOne({ _id: req.user._id }, { $inc: { totalExpense: -price } }, { session });

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({ success: true, message: "Deletion successful" });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error in deleting expense:", error);
		res.status(500).json({ success: false, message: "Error Deleting Data From the Database" });
	}
};

/**
 * Middleware to edit an expense in the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.editDataInDatabase = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const id = req.params.id;
		const { description, price, category } = req.body;

		// Find the old expense to calculate the price difference
		const oldExpense = await Expense.findOne({ _id: id }, { _id: 0, price: 1 }).exec();
		const oldPrice = oldExpense.price;
		const effectivePrice = oldPrice - price;

		// Update the expense document
		const updatedData = await Expense.findByIdAndUpdate(id, {
			description,
			price,
			category,
		}).session(session);

		// Update the user's totalExpense field
		await User.updateOne({ _id: req.user._id }, { $inc: { totalExpense: -effectivePrice } }).session(session);

		await session.commitTransaction();
		session.endSession();

		res.status(200).json(updatedData);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error in editing expense:", error);
		res.status(500).json({ success: false, message: "Error Editing Data from the Database" });
	}
};

/**
 * Middleware to get all expenses from the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.getAllDataFromDatabase = async (req, res) => {
	try {
		// Find all expenses associated with the current user
		const dbData = await Expense.find({ user: req.user._id });

		// Map the Mongoose documents to plain JavaScript objects
		const data = dbData.map((expense) => expense.toObject());

		res.status(200).json(data);
	} catch (error) {
		console.error("Error in retrieving all expenses:", error);
		res.status(500).json({ success: false, message: "Error retrieving all data from the database" });
	}
};

/**
 * Middleware to get paginated expenses from the database.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.getPaginatedData = async (req, res) => {
	const currentPage = parseInt(req.query.page) || 1;
	const perPage = parseInt(req.query.count) || 3;
	const userId = req.user._id;

	try {
		const totalExpenses = await Expense.countDocuments({ user: userId });

		const expenses = await Expense.find({ user: userId })
			.skip((currentPage - 1) * perPage)
			.limit(perPage);

		const hasNextPage = currentPage * perPage < totalExpenses;
		const hasPreviousPage = currentPage > 1;

		const responseData = {
			pageData: expenses,
			currentPage,
			hasNextPage,
			hasPreviousPage,
			totalExpenses,
			totalPages: Math.ceil(totalExpenses / perPage),
		};

		res.status(200).json({
			success: true,
			message: "Successfully retrieved paginated data.",
			data: responseData,
		});
	} catch (error) {
		console.error("Error in retrieving paginated data:", error);
		res.status(500).json({ success: false, error: "Error retrieving paginated data" });
	}
};

/**
 * Middleware to add income to the user's profile.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.addIncome = async (req, res) => {
	try {
		const { _id } = req.user;
		const { amount } = req.body;

		// Update the user's income field
		const response = await User.updateOne({ _id }, { income: amount });

		res.status(200).json({ success: true, message: "Income added successfully", response });
	} catch (error) {
		console.error("Error in adding income:", error);
		res.status(500).json({ success: false, message: "Error adding income" });
	}
};
