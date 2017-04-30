'use strict';

const makeModel = require('../helpers/make-model');

module.exports = makeModel('Event', {
	background: {
		image: String
	},
	body: {
		md: String,
		html: String
	},
	slug: {
		type: String,
		unique: true
	},
	start: {
		dateTime: Date,
		dateTimeString: String,
		format: String
	},
	textColor: String,
	title: String
});
