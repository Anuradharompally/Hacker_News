// routes/auth.news.js

const express = require("express");
const router = express.Router();
const newsSchema = require("../models/News");
const authorize = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { route } = require("./auth.routes");
const News = require("../models/News");

// Get all News
router.get("/", (req, res, next) => {
	newsSchema
		.find()
		.select("_id title link point username timestamp")
		.exec()
		.then((docs) => {
			const response = {
				count: docs.length,
				news: docs,
			};
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

// Post new News
router.post("/", authorize, (req, res, next) => {
	const news = new News({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		link: req.body.link,
		username: req.userData.email,
		points: 0,
		timestamp: Date.now(),
	});

    news.save()
       .then((result) => {
        console.log(result);
        res.status(201).json({
            message: `News created successfully with id ${result.id}`,
            news: news,
        });
    })
    
});

// Get Single News
router.get("/:newsId", (req, res, next) => {
const id = req.params.newsId;
News.findById(id)
    .exec()
    .then((doc) => {
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ message: `Please Enter valid News ID` });
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

module.exports = router;


