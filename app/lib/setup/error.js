'use strict';

const logger = require('./logger');

module.exports = function setup (app) {
	app.use(handleError);
};

function handleError (err, req, res, next) {
	if (!err) return next(err);

	logger.error(err);
	res.send(500, `
		<h1>Oh noes!</h1>
		<h2>${err.message}</h2>
		<pre>${err.trace}</pre>
	`);
}
