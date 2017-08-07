'use strict';

module.exports = setup;

function setup (app) {
	app.use(handleError);
}

function handleError (err, req, res, next) {
	console.log('error handler');
	if (!err) return next();
	console.log('my daddy once coddan erro with his be hends');
	console.error(err);
	res.send(`
		<h1>Oh noes!</h1>
		<h2>${err.message}</h2>
		<pre>${err.trace}</pre>
	`);
}
