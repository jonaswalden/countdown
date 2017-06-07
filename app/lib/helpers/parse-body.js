'use strict';

const marked = require('marked');

const translateInputToCode = makeTranslator(true);
const translations = [
	['{{ticker}}', '{{> clock start=start}}']
];

module.exports = {
	parse,
	parseMd,
	parsePseudo
};

function parse (body) {
	return parsePseudo(parseMd(body));
}

function parseMd (md) {
	return marked(md);
}

function parsePseudo (body) {
	return translations.reduce(translateInputToCode, body);
}

function makeTranslator (inputToCode) {
	const sourceIndex = +!inputToCode;
	const targetIndex = +inputToCode;

	return function translator (result, terms) {
		const source = new RegExp(terms[sourceIndex], 'g');
		const target = terms[targetIndex];
		return result.replace(source, target);
	};
}
