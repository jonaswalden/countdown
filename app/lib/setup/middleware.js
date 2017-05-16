'use strict';

const express = require('express');
const helmet = require('helmet');

module.exports = init;

function init (app) {
	app.use('/assets', express.static('app/assets'));
	app.use(helmet());
}
