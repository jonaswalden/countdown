'use strict';

module.exports = {
	map: {
		inline: false,
	},
	plugins: [
		require('postcss-import')(),
		require('cssnano')(),
	]
};
