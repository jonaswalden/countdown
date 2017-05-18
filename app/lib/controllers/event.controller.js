'use strict';

const _ = require('lodash');
const Event = require('../models/event.model');

module.exports = {
	renderAll,
	renderCreate,
	renderUpdate,
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

function renderUpdate (req, res) {
	Event.find(
		{slug: req.params.eventSlug},
		(err, docs) => {
			if (err) return res.send(err);

			res.render('pages/edit-event', {
				postPath: req.path,
				editingEvent: true,
				event: docs[0]
			});
		}
	);
}

function renderSingle (req, res) {
	Event.findOne(
		{slug: req.params.eventSlug},
		(err, event) => {
			if (err) return res.send(err);

			res.render('pages/event', {event});
		}
	);
}

function create (req, res, next) {
	const eventData = parseFormData(req.body);
	const event = new Event(eventData);

	event.save(err => {
		if (err && err.name) return res.redirect('/events/create/');
		if (err) return next(err);
		res.redirect('/events/');
	});
}

function update (req, res) {
	Event.findOne(
		{'slug': req.params.eventSlug},
		(err, event) => {
			if (err) return res.send(err);
			const eventData = parseFormData(req.body);
			Object.assign(event, eventData);

			event.save((saveErr, savedEvent) => {
				if (saveErr) return res.send(saveErr);
				res.redirect(`/events/${savedEvent.slug}/`);
			});
		}
  );
}

function seed (req, res) {
	var insertions = [];
	var errors = [];
	var events = [
		{title: 'Event 1', start: Date('2018-01-01'), body: '# {{title}} 1'},
		{title: 'Event 2', start: Date('2018-01-01'), body: '# {{title}} 2'},
		{title: 'Event 3', start: Date('2018-01-01'), body: '# {{title}} 3'},
		{title: 'Event 4', start: Date('2018-01-01'), body: '# {{title}} 4'}
	];

	Event.remove({}, () => {
		for (var event of events) {
			event = new Event(event);
			insertions.push(event.save(err => {
				if (err) errors.push(err);
			}));
		}
	});

	Promise.all(insertions).then(() => {
		if (errors.length) return res.send(new Error('error removing'));
		console.log('seeding done');
		res.redirect('/events/');
	});
}

function clear (req, res) {
	Event.remove({}, err => {
		if (err) return res.send(err);

		res.redirect('/events/');
	});
}

function parseFormData (formData) {
	return Object.keys(formData).reduce((obj, keyPath) => {
		return _.set(obj, keyPath, formData[keyPath]);
	}, {});
}
