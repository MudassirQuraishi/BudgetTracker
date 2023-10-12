const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reportSchema = new Schema({
	fileUrl: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Report", reportSchema);
