const makeModel = require('../helpers/make-model');

module.exports = makeModel('Event', {
	title: String,
	slug: {
		type: String,
		unique: true
	},
	start: {
		dateTime: Date,
		format: String
	},
	body: {
		md: String,
		html: String
	},
	background: {
		image: String
	},
	textColor: String
});