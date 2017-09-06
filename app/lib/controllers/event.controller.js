'use strict';

const _ = require('lodash');

const Event = require('../models/event.model');
const handleImage = require('../helpers/handle-image');

module.exports = {
	clear,
	create,
	renderAll,
	renderCreate,
	renderSingle,
	renderUpdate,
	seed,
	update
};

function renderAll (req, res) {
	Event.find((err, events) => {
		if (err) return res.send(err);
		res.render('pages/events', {events});
	});
}

function renderCreate (req, res) {
	res.render('pages/event-form', {
		postPath: req.path,
		title: 'New event'
	});
}

function renderUpdate (req, res) {
	Event.findOne(
		{slug: req.params.eventSlug},
		(err, event) => {
			if (err) return res.send(err);

			res.render('pages/event-form', {
				postPath: req.path + '?_method=PUT',
				title: 'Editing event',
				event
			});
		}
	);
}

function renderSingle (req, res) {
	Event.findOne(
		{slug: req.params.eventSlug},
		(err, event) => {
			if (err) return res.send(err);
			if (!event) return res.sendStatus(404);
			event.style.tickerFormat = '{{d}} d, {{hh}}:{{mm}}:{{ss}}';
			res.render('pages/event', {event});
		}
	);
}

async function create (req, res, next) {
	try {
		const eventData = await handleFormData(req);
		const event = new Event(eventData);
		event.save(saved);
	}
	catch (err) {
		next(err);
	}

	function saved (err, event) {
		if (err && err.name) return res.redirect('/events/create/');
		if (err) return next(err);
		res.redirect(`/event/edit/${event.slug}/`);
	}
}

function update (req, res, next) {
	const {_id} = req.body;
	if (!_id) return next(new Error('missing event id'));

	Event.findById(_id, found);

	async function found (err, event) {
	 if (err) return next(err);

	 try {
		 await handleFormData(req, event);
		 event.save(saved);
	 }
	 catch (err) {
		 next(err);
	 }
 }

 function saved (err, savedEvent) {
	 if (err) return next(err);
	 res.redirect(`/event/${savedEvent.slug}/`);
 }
}

async function handleFormData (req, dest = {}) {
	const eventData = Object.assign({}, req.body);

	if (req.file) {
		eventData[req.file.fieldname] = await handleImage(req.file);
	}

	return Object.keys(eventData).reduce((formData, keyPath) => {
		return _.set(formData, keyPath, eventData[keyPath]);
	}, dest);
}


function seed (req, res) {
	const insertions = [];
	const errors = [];
	const events = [
		{title: 'Event 1', start: Date('2018-01-01'), body: '# {{title}} 1'},
		{title: 'Event 2', start: Date('2018-01-01'), body: '# {{title}} 2'},
		{title: 'Event 3', start: Date('2018-01-01'), body: '# {{title}} 3'},
		{title: 'Event 4', start: Date('2018-01-01'), body: '# {{title}} 4'}
	];

	Event.remove({}, () => {
		for (let event of events) {
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
