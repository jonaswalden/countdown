'use strict';

const {Router} = require('express');

const eventController = require('../controllers/event.controller');
const fileHandler = require('../setup/files');

module.exports = setup;

function setup (app) {
	app.use(getRouter());
}

function getRouter () {
	const router = Router();
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

	// Default
	router.get('/', (req, res) => {
		res.redirect('/events/');
	});

	// router.get('*', (req, res) => {
	// 	res.render('pages/404');
	// });

	return router;
}
