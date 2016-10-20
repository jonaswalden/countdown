const express = require('express');
const mongoose = require('mongoose');
const {init: setupHandlebars} = require('./app/setup/handlebars');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/countdown');

app.use(express.static(`${__dirname}/public`));
app.use(require('./app/routes'));

setupHandlebars(app);

app.listen(port, () => {
	console.log(`app listening on ${port}`);
});
