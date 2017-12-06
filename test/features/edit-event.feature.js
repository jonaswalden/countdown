'use strict';

const cheerio = require('cheerio');
const request = require('supertest');

const app = require('../../app/app');
const factory = require('../helpers/factories');
const Event = require('../../app/lib/models/event.model');

feature('Edit event', () => {
	before(() => Event.remove({}));

	scenario('User edits an event', () => {
		let $, event, postPath, changedBody;

		given('we have an event', async () => {
			const _event = await factory.attrs('event', {backgroundImage: null});
			event = new Event(_event);
			await event.save();
		});

		when('the user visits the edit event page', done => {
			request(app)
				.get(`/event/edit/${event.slug}/`)
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

		and('action value should have method-override parameter', () => {
			expect(postPath).to.contain('_method=PUT');
		});

		and('there should be an id field', () => {
			const $id = $('#fi-id');
			expect($id.attr('name')).to.equal('_id');
			expect($id.val()).to.equal(event._id.toString());
			expect($id.attr('type')).to.equal('hidden');
		});

		when('the user makes a change', () => {
			changedBody = event.body + ' change from test';
		});

		and('posts the form', done => {
			request(app)
				.post(postPath)
				.field('_id', event._id.toString())
				.field('body', changedBody)
				.expect(302, done);
		});

		then('event gets persisted to the database', done => {
			Event.find({}, (err, dbEvents) => {
				if (err) return done(err);

				expect(dbEvents.length).to.equal(1);
				const [dbEvent] = dbEvents;
				expect(dbEvent.title).to.contain(event.title);
				expect(dbEvent.body).to.contain('change from test');
				done();
			});
		});
	});
});
