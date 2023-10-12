const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the report schema
const reportSchema = new Schema({
	fileUrl: {
		type: String,
		required: true,
	},
});

// Create and export the Report model using the report schema
module.exports = mongoose.model("Report", reportSchema);
