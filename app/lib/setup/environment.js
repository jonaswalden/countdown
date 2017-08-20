'use strict';

module.exports = setup;

function setup (environment) {
	process.env.TZ = 'Europe/Stockholm';

	if (process.env.NODE_ENV) return;
	process.env.NODE_ENV = environment || 'development';
}
