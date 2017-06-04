'use strict';

const express = require('express');

const eventController = require('../controllers/event.controller');
const fileHandler = require('../setup/files');
const handleImage = require('../helpers/handle-image');

module.exports = setup;

function setup (app) {
	app.use(getRouter());
}

function getRouter () {
	const router = express.Router();
	const handleBackgroundImage = fileHandler.single('style.background.image');

	// Events
	router.get('/events/', eventController.renderAll);

	router.get('/events/create/', eventController.renderCreate);
	router.post('/events/create/', handleBackgroundImage, eventController.create);

	// Event
	router.get('/event/:eventSlug/', eventController.renderSingle);

	router.get('/event/edit/:eventSlug/', eventController.renderUpdate);
	router.put('/event/edit/:eventSlug/', handleBackgroundImage, eventController.update);

  // Debug/dev
	router.get('/events/seed/', eventController.seed);

	router.get('/events/clear/', eventController.clear);

	router.get('/try-image-upload/', (req, res) => {
		res.send(`
			<form method="POST" action="/try-image-upload/" enctype="multipart/form-data">
				<label>Image</label>
				<input type="file" name="style.background.image" />
				<button>Do it</button>
			</form>
		`);
	});
	router.post('/try-image-upload/', handleBackgroundImage, async (req, res, next) => {
		try {
			const imageId = await handleImage(req.file);
			res.send(`
				<h1>success: ${imageId}</h1>
				<a href="/try-image-upload">again</a>
			`);
		} catch (err) {
			next(err);
		}
	});

	// Default
	router.get('/', (req, res) => {
		res.redirect('/events/');
	});

	// router.get('*', (req, res) => {
	// 	res.render('pages/404');
	// });

	return router;
}
