'use strict';

const cheerio = require('cheerio');
const request = require('supertest');

const app = require('../../app/app');
const factories = require('../helpers/factories');
const Event = require('../../app/lib/models/event.model');

Feature('Create event', () => {
	Scenario('User creates an event', () => {
		let $, event, postPath;

		before(() => {
			factories.build('event', newEvent => {
				event = newEvent;
			});
		});

		after(done => {
			Event.remove({}, done);
		});

		When('the user visits the create event page', done => {
			request(app)
				.get('/events/create/')
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					$ = cheerio.load(res.text);
					done();
				});
		});

		Then('they should see an event form', () => {
			const form = $('form');
			expect(form.length).to.equal(1);
			postPath = form.attr('action');
		});

		When('the user posts the form', done => {
			request(app)
				.post(postPath)
				.field('title', event.title)
				.field('time', event.start.dateTimeString)
				.field('body-md', event.body.md)
				.field('text-color', event.textColor)
				.field('background-image', event.background.image)
				.expect(302, done);
		});

		Then('event gets persisted to the database', done => {
			Event.find({}, (err, events) => {
				if (err) return done(err);

				expect(events.length).to.equal(1);
				expect(events[0]).to.have.property('title', event.title);
				done();
			});
		});
	});
});
