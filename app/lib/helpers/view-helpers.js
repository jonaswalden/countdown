'use strict';

const exphbs = require('express-handlebars');
const moment = require('moment');

const {TimeLeft} = require('./ticker');
const tickerPartial = require('../../views/partials/ticker');

module.exports = {
	compileEventBody: CompileEventBody(),
	dateTime,
	defaultValue,
	jsonDate,
	timeLeft
};

function defaultValue (...values) {
	return values.find(v => typeof v !== 'undefined');
}

function timeLeft (date, format) {
	if (!date || !format) return;
	const {timeString} = TimeLeft(date, format)();
	return timeString;
}

function dateTime (date) {
	return moment(date).format('MMM Do, hh:mm');
}

function jsonDate (date) {
	try {
		return date.toJSON();
	}
	catch (err) {
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
		if (!template  || !context) return;
		return localHbs.handlebars.compile(template)(context);
	}
}
