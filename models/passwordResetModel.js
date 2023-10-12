const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const resetSchema = new Schema({
	uuid: {
		type: String,
		required: true,
	},
	isacative: {
		type: Boolean,
		default: true,
	},
});

module.exports = mongoose.model("reset", resetSchema);
