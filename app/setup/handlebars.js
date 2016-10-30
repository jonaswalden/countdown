'use strict';

const exphbs = require('express-handlebars');
const helpers = require('../helpers/handlebars');
const hbs = exphbs.create({
	extname: '.hbs',
	defaultLayout: 'main',
	helpers
});

module.exports = {
	init,
	hbs
};

function init (app) {
	app.engine('.hbs', hbs.engine);
	app.set('view engine', '.hbs');
}
