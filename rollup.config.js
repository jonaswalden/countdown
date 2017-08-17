import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
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
