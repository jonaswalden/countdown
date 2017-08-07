'use strict';

const express = require('express');
const helmet = require('helmet');
const methodOverride = require('method-override');

module.exports = setup;

function setup (app) {
	app.use('/assets', express.static('app/assets'));
	app.use(helmet());
	app.use(methodOverride('_method'));
}
