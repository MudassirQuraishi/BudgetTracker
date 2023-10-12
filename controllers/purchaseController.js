const Razorpay = require("razorpay");
const Order = require("../models/ordersModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

/**
 * Middleware to initiate the purchase of a premium membership.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.buyPremium = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	const key_id = process.env.RAZORPAY_KEY_ID;
	const key_secret = process.env.RAZORPAY_KEY_SECRET;

	try {
		const rzp = new Razorpay({
			key_id: key_id,
			key_secret: key_secret,
		});

		const options = {
			amount: 2500, // Change this to your desired amount
			currency: "INR",
		};

		const order = await rzp.orders.create(options);

		const orderData = await Order.create(
			{
				orderId: order.id,
				status: "PENDING",
				UserId: req.user.id,
			},
			{ session },
		);

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({ order, key_id: rzp.key_id });
	} catch (error) {
		console.error(error);
		await session.abortTransaction();
		session.endSession();

		res.status(500).json({ message: "Something went wrong", error: error });
	}
};

/**
 * Middleware to update the user's membership after a successful payment.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.updateMembership = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const orderId = req.body.order_id;

		// Find the order using Mongoose
		const prevData = await Order.findOne({ orderId }, null, { session });

		if (!prevData) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ message: "Order not found" });
		}

		const status = prevData.status;

		if (status === "PENDING") {
			// Update the order status
			await Order.updateOne(
				{ orderId },
				{
					paymentId: req.body.payment_id,
					status: "SUCCESS",
				},
				{ session },
			);

			// Update user's premium status
			await User.updateOne(
				{ _id: prevData.UserId },
				{
					isPremium: true,
				},
				{ session },
			);

			await session.commitTransaction();
			session.endSession();

			// Send a success response
			return res.status(200).json({
				message: "Membership updated successfully",
				data: { isPremium: true },
			});
		} else {
			// Handle the case where the status is not "PENDING"
			await session.abortTransaction();
			session.endSession();

			return res.status(400).json({
				message: "Order status is not PENDING",
			});
		}
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		return res.status(500).json({ error: "Error updating membership" });
	}
};

/**
 * Middleware to handle a failed purchase and initiate a rollback.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.failedPurchase = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const orderId = req.body.error.metadata.order_id;
		const paymentId = req.body.error.metadata.payment_id;

		// Update the order status to "FAILED"
		await Order.updateOne(
			{ orderId },
			{
				paymentId,
				status: "FAILED",
			},
			{ session },
		);

		// Update user's premium status to "false"
		await User.updateOne(
			{ _id: req.user._id },
			{
				isPremium: false,
			},
			{ session },
		);

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			message: "Failed to purchase. Initiating rollback",
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		res.status(500).json({ message: error.message });
	}
};
