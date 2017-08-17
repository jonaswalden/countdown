'use strict';

const exphbs = require('express-handlebars');

const {TimeLeft} = require('./ticker');
const tickerPartial = require('../../views/partials/ticker');

module.exports = {
	timeLeft,
	jsonDate,
	compileEventBody: CompileEventBody()
};

function timeLeft (date, format) {
	if (!date || !format) return console.error('timeLeft', date, format);
	const {timeString} = TimeLeft(date, format)();
	return timeString;
}

function jsonDate (date) {
	try {
		console.log('jsonDate', typeof date, date);
		return date.toJSON();
	}
	catch (err) {
		console.error('toJSON', date);
		return date;
	}
}

function CompileEventBody () {
	const localHbs = exphbs.create();
	localHbs.handlebars.registerPartial('ticker', tickerPartial);
	localHbs.handlebars.registerHelper('jsonDate', jsonDate);
	localHbs.handlebars.registerHelper('timeLeft', timeLeft);

	return compile;

	function compile (template, context) {
		if (!template  || !context) return console.error('compileEventBody', template, context);
		return localHbs.handlebars.compile(template)(context);
	}
}
