'use strict';

const cheerio = require('cheerio');
const request = require('supertest');

const app = require('../../app/app');
const factories = require('../helpers/factories');
const Event = require('../../app/lib/models/event.model');

feature('Create event', () => {
	before(() => Event.remove({}));

	scenario('User creates an event', () => {
		let $, eventData, postPath;

		before(async () => {
			eventData = await factories.attrs('event');
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
				.field('title', eventData.title)
				.field('startString', eventData.startString)
				.field('body', eventData.body)
				.field('style.text.color', eventData.style.text.color)
				.field('style.background.color', eventData.style.background.color)
				.attach('backgroundImage', eventData.backgroundImage)
				.expect(302, done);
		});

		then('event gets persisted to the database', done => {
			console.log('query- slug:', eventData.slug);
			Event.find({}, (err, dbEvents) => {
				if (err) return done(err);

				expect(dbEvents.length).to.equal(1);
				expect(dbEvents[0]).to.have.property('title', eventData.title);
				done();
			});
		});
	});
});
