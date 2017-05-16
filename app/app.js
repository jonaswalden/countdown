'use strict';

const express = require('express');
const setupDatabase = require('./lib/setup/database');
const setupEnvironment = require('./lib/setup/environment');
const setupMiddleware = require('./lib/setup/middleware');
const setupRoutes = require('./lib/setup/routes');
const setupViews = require('./lib/setup/views');

const app = express();

setupEnvironment();
setupDatabase();
setupMiddleware(app);
setupRoutes(app);
setupViews(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`countdown on ${port}`); // eslint-disable-line no-console
});

module.exports = app;
