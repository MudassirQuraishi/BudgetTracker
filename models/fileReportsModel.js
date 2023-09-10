const Sequelize = require("sequelize");
const sequelize = require("../utilities/database");

const Reports = sequelize.define("reports", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileUrl: {
    type: Sequelize.STRING,
  },
});

module.exports = Reports;
