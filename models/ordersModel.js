const Sequelize = require("sequelize");

const sequelize = require("../utilities/database");

//creating a model
const Orders = sequelize.define("orders", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  paymentId: {
    type: Sequelize.STRING,
  },
  orderId: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});

module.exports = Orders;
