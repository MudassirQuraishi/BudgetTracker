const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		userName: {
			type: String,
			required: true,
		},
		userEmail: {
			type: String,
			required: true,
			unique: true,
		},
		userPassword: {
			type: String,
			required: true,
		},

		isPremium: {
			type: Boolean,
			default: false,
		},
		totalExpense: {
			type: Number,
			default: 0,
		},
		income: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("User", userSchema);
