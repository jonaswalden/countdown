'use strict';

const exphbs = require('express-handlebars');
const helpers = require('../helpers/handlebars');
let hbs;

module.exports = {
	setup,
	getEngine
};

function setup (app) {
	app.engine('hbs', getEngine().engine);
	app.set('view engine', 'hbs');
	app.set('views', 'app/views');
}

function getEngine () {
	if (hbs) return hbs;

	return hbs = exphbs.create({
		extname: '.hbs',
		defaultLayout: 'main',
		layoutsDir: 'app/views/layouts',
		partialsDir: 'app/views/partials',
		helpers
	});
}
