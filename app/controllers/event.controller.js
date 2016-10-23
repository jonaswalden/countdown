const {parse: parseBody} = require('../helpers/parse-body');
const {hbs} = require('../setup/handlebars');
const Event = require('../models/event.model');

module.exports = {
	renderAll,
	renderEdit,
	renderCreate,
	renderSingle,
	handleUndefinedSingle,
	create,
	seed,
	clear
};

function renderAll (req, res) {
	Event.find(function (err, events) {
		if (err) return res.send(err);

		res.render('pages/events', {events});
	});
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

function renderCreate (req, res) {
	res.render('pages/edit-event', {
		postPath: req.path
	});
}

function renderSingle (req, res) {
	Event.find(
		{slug: req.params.eventSlug},
		(err, result) => {
			if (err) return res.send(err);
			const event = result[0];
			res.render('pages/event', {
				event,
				helpers: {
					compile: function compileHelper (template, context) {
						hbs.handlebars.registerPartial('clock', require('../../views/partials/clock'));
						return hbs.handlebars.compile(template)(context);
					}
				}
			});
		}
	);
}

function handleUndefinedSingle (req, res) {
	res.redirect('/events/');
}

function create (req, res) {
	var event = req.body;
	event.slug = event.title.toLowerCase();
	event.start = {format: 'hh:mm', datetime: new Date(event.time)};
	event.body = {md: event['body-md']};
	event.body.html = parseBody(event.body.md, event);
	event.background = {image: req.file ? req.file.path : ''};

	event = new Event(event);
	event.save((err) => {
		if (err) return res.send(err);
		res.redirect('/events/');
	});
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
