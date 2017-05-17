'use strict';

const express = require('express');
const multer = require('multer');
const eventController = require('../controllers/event.controller');

module.exports = setup;

function setup (app) {
	app.use(getRouter());
}

function getRouter () {
	const upload = multer({dest: '../../resources/temp/'});
	const router = express.Router();

	// Events
	router.get('/events/', eventController.renderAll);

	router.get('/events/create/', eventController.renderCreate);
	router.post('/events/create/', upload.single('background-image'), eventController.create);

	// Event
	router.get('/event/:eventSlug/', eventController.renderSingle);

	router.get('/event/edit/:eventSlug/', eventController.renderUpdate);
	router.put('/event/edit/:eventSlug/', upload.single('background-image'), eventController.update);

  // Debug/dev
	router.get('/events/seed/', eventController.seed);

	router.get('/events/clear/', eventController.clear);

	// Default
	router.get('/', (req, res) => {
		res.redirect('/events/');
	});

	// router.get('*', (req, res) => {
	// 	res.render('pages/404');
	// });

	return router;
}
