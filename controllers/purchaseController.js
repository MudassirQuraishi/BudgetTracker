const Razorpay = require("razorpay");

//importig models
const Order = require("../models/ordersModel");
const User = require("../models/userModel");

const sequelize = require("../utilities/database");

//middleware functions

//to buy premium membership
exports.buyPremium = async (req, res, next) => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  try {
    const rzp = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });
    const options = {
      amount: 2500,
      currency: "INR",
    };
    const order = await rzp.orders.create(options);
    const orderData = await Order.create({
      orderId: order.id,
      status: "PENDING",
      UserId: req.user.id,
    });
    res.status(200).json({ order, key_id: rzp.key_id });
  } catch (error) {
    //res.status(403).json({ message: "Something went wrong", error: error });
  }
};

exports.updateMembership = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const prevData = await Order.findOne(
      {
        where: { orderId: req.body.order_id },
      },
      { transaction: t }
    );
    const orderId = prevData.dataValues.UserId;
    const status = prevData.dataValues.status;
    if (status === "PENDING") {
      const data = await Order.update(
        {
          paymentId: req.body.payment_id,
          status: "SUCCESS",
        },
        { where: { orderId: req.body.order_id } },
        { transaction: t }
      );
      const premiumStatus = await User.update(
        {
          isPremium: true,
        },
        { where: { id: orderId } },
        { transaction: t }
      );
      const userData = await User.findAll(
        { where: { id: orderId } },
        { transaction: t }
      );
      const premiumData = {
        isPremium: userData[0].dataValues.isPremium,
      };
      await t.commit();
      return res.status(200).json({
        message: "Membership updated successfully",
        data: premiumData,
      });
    }
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: "Error updating membership" });
  }
};

exports.failedPurchase = async (req, res, next) => {
  const t = await sequelize.transaction();
  const orderid = req.body.error.metadata.order_id;
  const paymentid = req.body.error.metadata.payment_id;
  try {
    await Order.update(
      {
        paymentId: paymentid,
        status: "FAILED",
      },
      { where: { orderId: orderid } },
      { transaction: t }
    );
    await User.update(
      {
        isPremium: false,
      },
      { where: { id: req.user.id } },
      { transaction: t }
    );
    await t.commit();
    res
      .status(200)
      .json({ message: "Failed to purchase. Initiating rollback" }); // Send response here
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message }); // Send response here
  }
};
