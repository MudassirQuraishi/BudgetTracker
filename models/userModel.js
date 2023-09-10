const Sequelize = require("sequelize");

const sequelize = require("../utilities/database");

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  userName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
  },
  isPremium: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  income: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  totalExpense: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;
