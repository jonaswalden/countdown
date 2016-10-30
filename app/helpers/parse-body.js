'use strict';

const marked = require('marked');
const translateInputToCode = makeTranslator(true);

const translations = [
	['{{clock}}', '{{> clock start=start}}']
];

module.exports = {
	parse,
	parseMd,
	parsePseudo
	// parseHbs
};

function parse (body, locals) {
	return parsePseudo(parseMd(body));
}

function parseMd (md) {
	return marked(md);
}

function parsePseudo (body) {
	return translations.reduce(translateInputToCode, body);
}

// function parseHbs (hbs, locals) {
// 	return handlebars.compile(hbs)(locals);
// }

function makeTranslator (inputToCode) {
	const sourceIndex = +!inputToCode;
	const targetIndex = +inputToCode;

	return function translator (result, terms) {
		const source = new RegExp(terms[sourceIndex], 'g');
		const target = terms[targetIndex];
		return result.replace(source, target);
	}
}
