'use strict';

const {Router} = require('express');
const bodyParser = require('body-parser');
const eventController = require('../controllers/event.controller');
const fileHandler = require('../setup/files');
const userController = require('../controllers/user.controller');

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

	router.post('/user/sign-up/', bodyParser.urlencoded({extended: true}), userController.create);
	router.post('/user/sign-in/', bodyParser.urlencoded({extended: true}), userController.authenticate);
	router.get('/user/', userController.authorize, userController.show);

	// Default
	router.get('/', (req, res) => {
		res.redirect('/events/');
	});

	// router.get('*', (req, res) => {
	// 	res.render('pages/404');
	// });

	return router;
}
