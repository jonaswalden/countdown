const express = require('express');
const mongoose = require('mongoose');
const routes = require('./app/routes');
const {init: setupHandlebars} = require('./app/setup/handlebars');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/countdown');

app.use(express.static(`${__dirname}/public`));
app.use(routes);

setupHandlebars(app);

app.listen(port, () => {
	console.log(`app listening on ${port}`);
});
