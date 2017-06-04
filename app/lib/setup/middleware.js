'use strict';

const express = require('express');
const helmet = require('helmet');

module.exports = init;

function init (app) {
	app.use('/assets', express.static('app/assets'));
	app.use(helmet());
	app.use(handleError);
}

function handleError (err, req, res, next) {
	if (!err) return next();
	console.log('my daddy once coddan erro with his be hends');
	res.send(`
		<h1>Oh noes!</h1>
		<h2>${err.message}</h2>
		<pre>${err.trace}</pre>
	`);
}
