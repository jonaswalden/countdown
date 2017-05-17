'use strict';

const cheerio = require('cheerio');
const request = require('supertest');

const app = require('../../app/app');
const factories = require('../helpers/factories');
const Event = require('../../app/lib/models/event.model');

feature('Create event', () => {
	after(() => Event.remove({}));

	scenario('User creates an event', () => {
		let $, event, postPath;

		before(async () => {
			event = await factories.build('event');
			// console.log('testing', event);
		});

		when('the user visits the create event page', done => {
			request(app)
				.get('/events/create/')
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					$ = cheerio.load(res.text);
					done();
				});
		});

		then('they should see an event form', () => {
			const form = $('form');
			expect(form.length).to.equal(1);
			postPath = form.attr('action');
		});

		when('the user posts the form', done => {
			request(app)
				.post(postPath)
				.field('title', event.title)
				.field('startString', event.startString)
				.field('body', event.body)
				.field('style.text.color', event.style.text.color)
				.field('style.background.color', event.style.background.color)
				.field('style.background.image', event.style.background.image)
				.expect(302, done);
		});

		then('event gets persisted to the database', done => {
			Event.find({'slug': event.slug}, (err, dbEvents) => {
				if (err) return done(err);

				expect(dbEvents.length).to.equal(1);
				expect(dbEvents[0]).to.have.property('title', event.title);
				done();
			});
		});
	});
});
