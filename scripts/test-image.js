'use strict';

const gm = require('gm');
const path = require('path');

const root = path.join(__dirname, '..', './resources');

gm(`${root}/temp/test.jpg`)
	.identify((err, data) => {
		if (err) return console.error(err);
		console.log(data);
	})
	.noProfile()
	.write(`${root}/uploads/done.jpg`, (err) => {
		if (err) return console.error(err);
		console.log('success!');
	});
