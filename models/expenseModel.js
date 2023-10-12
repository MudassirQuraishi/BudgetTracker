const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the expense schema
const expenseSchema = new Schema({
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

// Create and export the Expense model using the expense schema
module.exports = mongoose.model("Expense", expenseSchema);
