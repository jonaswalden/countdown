'use strict';

module.exports = setup;

function setup (environment) {
	process.env.NODE_ENV = environment || 'development';
	process.env.TZ = 'Europe/Stockholm';
}
