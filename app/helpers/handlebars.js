'use strict';

const exphbs = require('express-handlebars');
const localHbs = exphbs.create();

localHbs.handlebars.registerPartial('clock', require('../../views/partials/clock'));
localHbs.handlebars.registerHelper('dateTime', dateTime);

module.exports = {
  dateTime,
  compileEventBody
};

function dateTime (date, format) {
  return 'dt: ' + format;
}

function compileEventBody (template, context) {
  return localHbs.handlebars.compile(template)(context);
}
