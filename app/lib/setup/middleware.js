'use strict';

const express = require('express');
const helmet = require('helmet');
const methodOverride = require('method-override');

module.exports = setup;

function setup (app) {
	app.use('/bundles', express.static('resources/bundles'));
	app.use('/images', express.static('resources/images'));
	app.use(helmet());
	app.use(methodOverride('_method'));

	if (process.env.NODE_ENV === 'development') {
		app.use(exposeDevEnvironment);
	}
}

function exposeDevEnvironment (req, res, next) {
	console.log('adding local');
	res.locals.DEVELOPMENT = true;
	next();
}
