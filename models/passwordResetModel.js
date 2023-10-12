const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the reset schema
const resetSchema = new Schema({
	uuid: {
		type: String,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

// Create and export the Reset model using the reset schema
module.exports = mongoose.model("Reset", resetSchema);
