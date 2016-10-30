'use strict';

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./server/routes');
const {init: setupHandlebars} = require('./server/setup/handlebars');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/countdown');

app.use('/assets', express.static('app/assets'));
app.use(helmet());
app.use(routes);

setupHandlebars(app);

app.listen(port, () => {
	console.log(`app listening on ${port}`);
});

module.exports = app;
