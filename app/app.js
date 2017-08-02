'use strict';

const express = require('express');
const setupDatabase = require('./lib/setup/database');
const setupEnvironment = require('./lib/setup/environment');
const setupError = require('./lib/setup/error');
const setupMiddleware = require('./lib/setup/middleware');
const setupRoutes = require('./lib/setup/routes');
const setupViews = require('./lib/setup/views');

const app = express();
const port = process.env.PORT || 3000;

setupEnvironment();
setupDatabase();
setupMiddleware(app);
setupViews(app);
setupRoutes(app);
setupError(app);

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => console.log(`countdown on ${port}`)); // eslint-disable-line no-console
}

module.exports = app;
