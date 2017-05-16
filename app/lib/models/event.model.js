'use strict';

const moment = require('moment');
const mongoose = require('mongoose');

const {parseMd} = require('../helpers/parse-body');
const slugify = require('../helpers/slugify');

const backgroundStyleSchema = new mongoose.Schema({
	color: String,
	image: String
});

const textStyleSchema = new mongoose.Schema({
	color: String
});

const eventStyleSchema = new mongoose.Schema({
	background: backgroundStyleSchema,
	text: textStyleSchema,
	tickerFormat: {
		type: String,
		default: 'HH:mm'
	}
});

const eventSchema = new mongoose.Schema({
	body: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		unique: true,
		required: true,
		set: setSlugFromTitle
	},
	start: {
		type: Date,
		required: true
		// min: Date.now()
	},
	style: eventStyleSchema,
	title: {
		type: String,
		required: true
	}
});

eventSchema
	.virtual('startString')
	.get(getStartStringFromStart)
	.set(setStartFromStartString);

eventSchema
	.virtual('bodyMarkup')
	.get(getBodyMarkup);

eventSchema.set('toObject', { getters: true, setters: true, virtuals: true });
eventSchema.set('toJSON', { getters: true, setters: true, virtuals: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;


function getStartStringFromStart () {
	console.log('getStartStringFromStart', this.start);
	return moment(this.start).format('YYYY-MM-DD HH:mm');
}

function setStartFromStartString (startString) {
	this.start = moment.utc(startString).toDate();
	console.log('setStartFromStartString', startString. this.start);
}

function getBodyMarkup () {
	console.log('getBodyMarkup');
	return parseMd(this.body);
}

function setSlugFromTitle (title) {
	console.log('setSlugFromTitle', title);
	return slugify(title);
}
