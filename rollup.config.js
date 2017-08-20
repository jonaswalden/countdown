'use strict';

const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

module.exports = {
	entry: 'app/assets/js/main.js',
	dest: 'resources/bundles/scripts.js',
	format: 'iife',
	sourceMap: true,
	plugins: [
		resolve(),
		commonjs(),
		babel()
	]
};
