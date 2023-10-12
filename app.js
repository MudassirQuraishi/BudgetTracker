// Importing necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// Importing routes
const loginRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const resetRoutes = require("./routes/passwordResetRoutes");

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Defining routes
app.use("/user", loginRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", resetRoutes);

// Serving static files from the 'public' directory
app.use((req, res) => {
	console.log(`Requested URL: ${req.url}`);
	res.sendFile(path.join(__dirname, `/public/${req.url}`));
});

// Connecting to the MongoDB database
mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB CONNECTION SUCCESSFUL");
		// Starting the server
		const port = process.env.PORT || 3000;
		app.listen(port, () => {
			console.log(`SERVER STARTED on port ${port}`);
		});
	})
	.catch((error) => {
		console.error("DB CONNECTION ERROR:", error.message);
	});
