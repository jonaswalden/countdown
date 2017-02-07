'use strict';

const Event = require('../models/event.model');
const {parse: parseBody} = require('../helpers/parse-body');

module.exports = {
	renderAll,
	renderCreate,
	renderEdit,
	renderSingle,
	create,
	update,
	seed,
	clear
};

function renderAll (req, res) {
	Event.find((err, events) => {
		if (err) return res.send(err);

		res.render('pages/events', {events});
	});
}

function renderCreate (req, res) {
	res.render('pages/edit-event', {postPath: req.path});
}

function renderEdit (req, res) {
	Event.find(
		{slug: req.params.eventSlug},
		(err, docs) => {
			if (err) return res.send(err);

			res.render('pages/edit-event', {
				postPath: req.path,
				event: docs[0]
			});
		}
	);
}

function renderSingle (req, res) {
	Event.find(
		{slug: req.params.eventSlug},
		(err, result) => {
			if (err) return res.send(err);

			res.render('pages/event', {event: result[0]});
		}
	);
}

function create (req, res) {
	var event = req.body;
	event.slug = event.title.toLowerCase().replace(/\s/g, '-');
	event.start = {format: 'hh:mm', dateTimeString: event.time};
	event.start.dateTime = new Date(event.start.dateTimeString);
	event.body = {md: event['body-md']};
	event.body.html = parseBody(event.body.md, event);
	event.background = {image: req.file ? req.file.path : ''};

	event = new Event(event);
	event.save((err) => {
		if (err) return res.send(err);
		res.redirect('/events/');
	});
}

function update (req, res) {

}

function seed (req, res) {
	var insertions = [];
	var errors = [];
	var events = [
		{title: 'kladd', slug: 'kladd'},
		{title: 'klidd', slug: 'klidd'},
		{title: 'kledd', slug: 'kledd'},
		{title: 'kludd', slug: 'kludd'}
	];

	Event.remove({}, () => {
		for (var event of events) {
			event = new Event(event);
			insertions.push(event.save((err) => {
				if (err) errors.push(err);
			}));
		}
	});

	Promise.all(insertions).then(() => {
		if (errors.length) return res.send(errors);

		res.redirect('/events/');
	});
}

function clear (req, res) {
	Event.remove({}, (err) => {
		if (err) return res.send(err);

		res.redirect('/events/');
	});
}
