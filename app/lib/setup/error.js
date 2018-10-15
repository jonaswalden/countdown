'use strict';

const logger = require('./logger');

module.exports = function setup (app) {
	app.use(handleError);
};

function handleError (err, req, res, next) {
	if (!err) return next(err);

	const status = err.status || 500;
	logger.error(err);
	res.status(status).send(`
		<h1>${status} Oh noes!</h1>
		<h2>${err.message}</h2>
		<pre>${err.trace}</pre>
	`);
}
