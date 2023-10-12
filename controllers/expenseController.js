//importing models
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

//importing sequelize
const mongoose = require("mongoose");

//middleware functions

//to save expense

exports.saveDataToDatabase = async (req, res) => {
	//const session = await mongoose.startSession();
	//session.startTransaction();

	try {
		const { _id } = req.user;
		console.log(_id);
		const { description, amount, category } = req.body;
		console.log(typeof description);
		console.log(typeof amount);
		console.log(typeof category);
		// Create the expense document using Expense.create
		const savedExpense = await Expense.create(
			[
				{
					description: description,
					price: amount,
					category: category,
					user: _id,
				},
			],
			//	{ session },
		);

		// Update the user's totalExpense field
		//await User.updateOne({ _id: _id }, { $inc: { totalExpense: amount } }, { session });

		//await session.commitTransaction();
		//session.endSession();

		res.status(201).json({ success: true, message: "Successfully added Expense", data: savedExpense });
	} catch (error) {
		console.log(error);
		//await session.abortTransaction();
		//	session.endSession();

		res.status(500).json({ error: "Error Adding Expense To The Database" });
	}
};

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
		res.status(500).json({ error: "Error Deleting Data From the Database" });
	}
};

// //to edit expense
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
		res.status(500).json({ error: "Error Editing Data from the Database" });
	}
};

//to get all the data when page refresh happens
exports.getAllDataFromDatabase = async (req, res) => {
	try {
		// Find all expenses associated with the current user
		const dbData = await Expense.find({ user: req.user._id });

		// Map the Mongoose documents to plain JavaScript objects
		const data = dbData.map((expense) => expense.toObject());

		res.status(200).json(data);
	} catch (err) {
		res.status(500).json({ error: "Error retrieving all data from the database" });
	}
};

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
		console.log(responseData);

		res.status(200).json({
			success: true,
			message: "Successfully retrieved paginated data.",
			data: responseData,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: "Error retrieving paginated data" });
	}
};

exports.addIncome = async (req, res) => {
	try {
		const { _id } = req.user;
		const { amount } = req.body;

		// Update the user's income field
		const response = await User.updateOne({ _id }, { income: amount });

		res.status(200).json({ success: true, message: "Income added successfully", response });
	} catch (error) {
		res.status(500).json({ success: false, message: "Error adding income" });
	}
};
