const Sequelize = require("sequelize");
const schema = process.env.DB_SCHEMA;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const sequelize = new Sequelize(schema, user, password, {
  dialect: "mysql",
  host: host,
});

module.exports = sequelize;
