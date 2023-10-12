//imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const path = require("path");

const mongoose = require("mongoose");
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

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// //middleware
app.use("/user", loginRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", resetRoutes);
app.use((req, res) => {
	console.log(req.url);
	res.sendFile(path.join(__dirname, `/public/${req.url}`));
});

mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		console.log("DB CONNECTION SUCCESSFUL");
		console.log("STARTING SERVER.....");
		app.listen(process.env.PORT);
		console.log("SERVER STARTED");
	})
	.catch((error) => {
		console.log(error.message);
	});
