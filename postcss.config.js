'use strict';

module.exports = {
	map: {
		inline: false
	},
	parser: require('postcss-comment'),
	plugins: [
		require('postcss-normalize'),
		require('postcss-easy-import'),
		require('postcss-nested'),
		require('css-mqpacker'),
		require('postcss-short'),
		require('postcss-cssnext'),
		require('cssnano')({autoprefixer: false}),
	]
};
