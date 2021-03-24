const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConfig = require("./database/db");
require("dotenv").config();

// Express APIs
const userRoute = require("./routes/auth.routes");
const newsRoute = require("./routes/auth.news");

// MongoDB conection
mongoose
	.connect(process.env.MONGODB_URI, {
		dbName: process.env.DB_NAME,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("mongodb connected.");
	})
	.catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => {
	console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (err) => {
	console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
	console.log("Mongoose connection is disconnected.");
});

process.on("SIGINT", async () => {
	await mongoose.connection.close();
	process.exit(0);
});

// Express settings
const app = express();
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(cors());

// Serve static resources
app.use("/public", express.static("public"));

app.use("/auth", userRoute);
app.use("/news", newsRoute);

// Define PORT
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
	console.log("Connected to port " + port);
});

// Express error handling
app.use((req, res, next) => {
	setImmediate(() => {
		next(new Error("Something went wrong"));
	});
});

app.use(function (err, req, res, next) {
	console.error(err.message);
	if (!err.statusCode) err.statusCode = 500;
	res.status(err.statusCode).send(err.message);
});

