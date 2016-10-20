const exphbs = require('express-handlebars');
const hbs = exphbs.create({
	defaultLayout: 'main',
	helpers: {
		eventBody: function () {
			return 'noe!';
		}
	}
});

Object.keys(hbs).forEach((key, index) => {
	console.log(index, key);
});

function init (app) {
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
}

module.exports = {init, hbs};
