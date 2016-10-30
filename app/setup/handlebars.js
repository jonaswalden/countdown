const exphbs = require('express-handlebars');
const helpers = require('../helpers/handlebars');
const hbs = exphbs.create({
	defaultLayout: 'main',
	helpers
});

module.exports = {
	init,
	hbs
};

function init (app) {
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
}
