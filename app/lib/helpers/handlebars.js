'use strict';

const exphbs = require('express-handlebars');

const localHbs = exphbs.create();

localHbs.handlebars.registerPartial('ticker', require('../../views/partials/ticker'));
localHbs.handlebars.registerHelper('dateTime', dateTime);

module.exports = {
	dateTime,
	compileEventBody
};

function dateTime (date, format) {
	if (!date || !format) return 'error parsing date';
	const timeLeft = (date.getTime() - Date.now()) / 1000 / 60;
	return timeLeft;
}

function compileEventBody (template, context) {
	if (!template  || !context) return 'error compiling body';
	return localHbs.handlebars.compile(template)(context);
}
