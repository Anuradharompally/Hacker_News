const mongoose = require("mongoose");

const newsSchema = mongoose.Schema({
	title: { type: String, required: true },
	link: { type: String, required: true },
	username: { type: String, required: true },
	points: { type: String },
	timestamp: { type: String, required: true },
});

module.exports = mongoose.model("News", newsSchema);
