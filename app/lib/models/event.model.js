'use strict';

const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const slugify = require('slugify');

const {parse: parseBody} = require('../helpers/parse-body');

const backgroundStyleSchema = new mongoose.Schema({
	color: String,
	image: String
});

const textStyleSchema = new mongoose.Schema({
	color: String,
	fontHeading: String,
	fontBody: String
});

const eventStyleSchema = new mongoose.Schema({
	background: backgroundStyleSchema,
	text: textStyleSchema,
	tickerFormat: {
		type: String,
		default: '{{hh}}:{{mm}}'
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
		required: true
	},
	start: {
		type: Date,
		required: true
		// min: Date.now()
	},
	style: eventStyleSchema,
	title: {
		type: String,
		required: true,
		set: setSlugFromTitle
	}
});

eventSchema
	.virtual('startString')
	.get(getStartStringFromStart)
	.set(setStartFromStartString);

eventSchema
	.virtual('bodyMarkup')
	.get(getBodyMarkup);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

function getStartStringFromStart () {
	return moment(this.start).format('YYYY-MM-DD HH:mm');
}

function setStartFromStartString (startString) {
	this.start = moment.utc(startString).toDate();
}

function getBodyMarkup () {
	return parseBody(this.body);
}

function setSlugFromTitle (title) {
	this.slug = slugify(title).toLowerCase();
	return title;
}
