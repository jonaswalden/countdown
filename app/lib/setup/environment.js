'use strict';

module.exports = setup;

function setup (environment) {
	if (process.env.NODE_ENV) return;
	process.env.NODE_ENV = environment || 'development';
	process.env.TZ = 'Europe/Stockholm';
}
