const exphbs = require('express-handlebars');
const helpers = require('../helpers/handlebars');
const hbs = exphbs.create({
	defaultLayout: 'main'
});

module.exports = {
	init,
	hbs
};

function init (app) {
	for (var name in helpers) {
		if (helpers.hasOwnProperty(name)) {
			hbs.handlebars.registerHelper(name, helpers[name]);
		}
	}

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
}
