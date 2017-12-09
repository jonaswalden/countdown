'use strict';

const marked = require('marked');
const translations = [
	['{{ticker}}', '{{> ticker start=start format=style.tickerFormat}}']
];

module.exports = parse;

function parse (body) {
	return parsePseudo(parseMd(body));
}

function parseMd (md) {
	const renderer = new marked.Renderer();
	renderer.heading = cleanHeading;
	return marked(md, {breaks: true, renderer});

	function cleanHeading (text, level) {
		return `<h${level}>${text}</h${level}>`;
	}
}

function parsePseudo (body) {
	return translations.reduce(translate, body);

	function translate (result, [pseudo, code]) {
		return result.replace(new RegExp(pseudo, 'g'), code);
	}
}
