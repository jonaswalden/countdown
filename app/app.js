'use strict';

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const setupRoutes = require('./lib/setup/routes');
const setupViews = require('./lib/setup/views');
const app = express();
const port = process.env.PORT || 3000;

// TODO: make database contextual.. tests...
mongoose.connect('mongodb://127.0.0.1:27017/countdown');

setupRoutes(app);
setupViews(app);

app.use('/assets', express.static('app/assets'));
app.use(helmet());

setupRoutes(app);
setupViews(app);

app.listen(port, () => {
	console.log(`app listening on ${port}`); // eslint-disable-line no-console
});

module.exports = app;
