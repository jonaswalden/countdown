'use strict';

module.exports = {
	map: false,
	plugins: [
		require('css-mqpacker'),
		require('cssnano')(),
	]
};
