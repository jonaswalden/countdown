'use strict';

const mongoose = require('mongoose');
const logger = require('./logger');

let connection;

module.exports = setupDatabase;
module.getConnection = getConnection;

function setupDatabase () {
	if (connection) return connection;

	const mongoUrl = 'mongodb://127.0.0.1:27017/';
	const dbName = (process.env.NODE_ENV === 'test') ? 'countdown-test' : 'countdown';

	mongoose.Promise = global.Promise;
	connection = mongoose.connect(mongoUrl + dbName);

	setupModels();
	setupErrorHandling();

	return connection;
}

function setupModels () {
	require('../models/event.model');
}

function getConnection () {
	if (!connection) throw(new Error());
	return connection;
}

function setupErrorHandling () {
	mongoose.connection.on('error', err => logger.error(err));
}
