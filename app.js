const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const sequelize = require("./utilities/database");
//importing models
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/ordersModel");
const ReportFiles = require("./models/fileReportsModel");
const ForogotPassword = require("./models/passwordResetModel");

//importing routes
const loginRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const resetRoutes = require("./routes/passwordResetRoutes");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "accesslog.txt"),
  { flags: "a" }
);

//table relations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForogotPassword);
ForogotPassword.belongsTo(User);

User.hasMany(ReportFiles);
ReportFiles.belongsTo(User);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

//middleware
app.use("/user", loginRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", resetRoutes);
app.use((req, res) => {
  console.log(req.url);
  res.send(path.join(__dirname, `/public/${req.url}`));
});

sequelize.sync().then(() => {
  const port = process.env.PORT;
  console.log(`Server started at ${port}`);
  app.listen(port);
});
