const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the order schema
const orderSchema = new Schema({
	paymentId: {
		type: String,
		required: true,
	},
	orderId: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["PENDING", "FAILED", "ACCEPTED"],
		required: true,
	},
});

// Create and export the Order model using the order schema
module.exports = mongoose.model("Order", orderSchema);
