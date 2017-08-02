'use strict';

const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');

const handleImage = require('../helpers/handle-image');
const {parse: parseBody} = require('../helpers/parse-body');
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

eventSchema
	.virtual('backgroundImage')
	.set(setBackgroundImageFromFile);

eventSchema.set('toObject', { getters: true, setters: true, virtuals: true });
eventSchema.set('toJSON', { getters: true, setters: true, virtuals: true });

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
	this.slug = slugify(title);
	return title;
}

async function setBackgroundImageFromFile (imageFile) {
	try {
		_.set(this, 'style.background.image', await handleImage(imageFile));
	}
	catch (err) {
		console.error('Error setting event background image', err);
	}
}
