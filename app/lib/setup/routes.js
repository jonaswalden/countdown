'use strict';

const express = require('express');
const multer = require('multer');
const eventController = require('./controllers/event.controller');

module.exports = {
	setup
};

function setup (app) {
	app.use(getRouter());
}

function getRouter () {
	const upload = multer({dest: '../../resources/temp/'});
	const router = express.Router();

	// Event
	router.get('/events/', eventController.renderAll);

	router.get('/events/edit/:eventSlug/', eventController.renderEdit);
	// router.post('/events/edit/:eventSlug', upload.single('background-image'), eventController.edit);

	router.get('/events/create/', eventController.renderCreate);
	router.post('/events/create/', upload.single('background-image'), eventController.create);

	router.get('/event/:eventSlug/', eventController.renderSingle);

	router.get('/event/', eventController.handleUndefinedSingle);

	router.get('/seed/events/', eventController.seed);
	router.get('/clear/events/', eventController.clear);

	// Default
	router.get('/', (req, res) => {
		res.render('pages/home');
	});

	return router;
}
