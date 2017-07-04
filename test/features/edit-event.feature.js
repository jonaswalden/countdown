'use strict';

const cheerio = require('cheerio');
const request = require('supertest');

const app = require('../../app/app');
const factories = require('../helpers/factories');
const Event = require('../../app/lib/models/event.model');

feature('Edit event', () => {
	before(() => Event.remove({}));

	scenario('User edits an event', () => {
		let $, event, postPath, changedBody;

		given('we have an event', done => {
			factories.attrs('event').then(_event => {
				event = new Event(_event);
				event.save(done);
			});
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

		and('there should be a method-override field', () => {
			const $methodOverride = $('#method-override');
			expect($methodOverride.length).to.equal(1);
			expect($methodOverride.attr('name')).to.equal('_method');
			expect($methodOverride.val()).to.equal('PUT');
			expect($methodOverride.attr('type')).to.equal('hidden');
		});

		and('there should be an id field', () => {
			const $id = $('#event-id');
			expect($id.length).to.equal(1);
			expect($id.attr('name')).to.equal('_id');
			expect($id.val()).to.equal(event._id);
			expect($id.attr('type')).to.equal('hidden');
		});

		when('the user makes a change', () => {
			changedBody = event.body + ' change from test';
		});

		and('posts the form', done => {
			request(app)
				.put(postPath)
				.field('title', event.title)
				.field('startString', event.startString)
				.field('body', changedBody)
				.field('style.text.color', event.style.text.color)
				.field('style.background.color', event.style.background.color)
				.field('backgroundImage', event.backgroundImage)
				.expect(302, done);
		});

		then('event gets persisted to the database', done => {
			Event.find({}, (err, dbEvents) => {
				if (err) return done(err);

				expect(dbEvents.length).to.equal(1);
				expect(dbEvents[0].title).to.contain(event.title);
				expect(dbEvents[0].body).to.contain('change from test');
				done();
			});
		});
	});
});
