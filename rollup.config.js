'use strict';

module.exports = {
	input: 'app/assets/scripts/main.js',
	output: {
		file: 'resources/bundles/scripts.js',
		format: 'iife',
		sourcemap: true,
	},
	plugins: [
		require('@rollup/plugin-node-resolve')(),
		require('@rollup/plugin-commonjs')(),
		require('rollup-plugin-babel')(),
	]
};
