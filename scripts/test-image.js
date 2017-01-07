'use strict';

const gm = require('gm').subClass({imageMagick: true});
const root = '../resources';

gm(`${root}/temp/test.jpg`).identify((err, data) => {
	if (err) return console.error(err);
	console.log(data);
});
// .noProfile()
// .write(`${root}/upload/done.jpg`, (err) => {
// 	if (err) return console.error(err);
// 	console.log('success!');
// });
