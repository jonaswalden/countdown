module.exports = {
	env: {
		es6: true,
		node: true
	},
	parserOptions: {
		ecmaVersion: 8
	},
	extends: 'eslint:recommended',
	rules: {
		'strict': ['error', 'safe'],
		'indent': ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'no-console': ['warn']
	}
};