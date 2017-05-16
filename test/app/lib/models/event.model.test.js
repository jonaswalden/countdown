'use strict';

const moment = require('moment');

const Event = require('../../../../app/lib/models/event.model');
const factory = require('../../../helpers/factories');
const slugify = require('../../../../app/lib/helpers/slugify');

const minimal = {minimal: true};

describe('event model', () => {
	const requiredProps = ['body', 'start', 'title'];
	const optionalProps = ['style'];
	const autoProps = ['slug'];
	const allProps = [].concat(requiredProps, optionalProps, autoProps);

	after(done => {
		Event.remove({}, done);
	});

	describe('full event', () => {
		let event, eventData;

		beforeEach(async () => {
			eventData = await factory.attrs('event');
		});

		it('is valid', (done) => {
			console.log(1);
			event = new Event(eventData);
			console.log(2);

			event.save(err => {
				expect(err).not.to.exist;
				done();
			});
		});

		it('has all expected props', () => {
			expect(Object.keys(eventData)).to.have.same.members(allProps);
		});
	});

	describe('minimal event', async () => {
		let event, eventData, fullEventData;

		beforeEach(async () => {
			const eventDataPromise = factory.attrs('event', {}, minimal);
			const fullEventDataPromise = factory.attrs('event');
			eventData = await eventDataPromise;
			fullEventData = await fullEventDataPromise;
		});

		it('is valid', async (done) => {
			console.log(1);
			event = new Event(eventData);
			console.log(2);

			event.save(err => {
				if (err) done(err);
				expect(err).not.to.exist;
				done();
			});
		});

		it('has all expected props', () => {
			expect(Object.keys(eventData)).to.have.same.members(requiredProps);
		});

		allProps.forEach(prop => {
			if (requiredProps.includes(prop)) {
				it(`is invalid if required prop ${prop} is missing`, done => {
					delete fullEventData[prop];
					console.log(1);
					event = new Event(fullEventData);
					console.log(2);

					event.save(err => {
						expect(err.errors).to.have.property(prop);
						expect(err.errors[prop].properties).to.have.property('type', 'required');
						done();
					});
				});
			}
			else {
				it(`is not invalid if optional prop ${prop} is missing`, done => {
					delete fullEventData[prop];
					console.log(1);
					event = new Event(fullEventData);
					console.log(2);

					event.save(err => {
						expect(err).not.to.exist;
						done();
					});
				});
			}
		});
	});

	describe('slug', () => {
		let event, eventData;

		beforeEach(async () => {
			eventData = await factory.attrs('event');
		});

		it('gets value from title', () => {
			delete eventData.slug;
			console.log(1, eventData.title);
			event = new Event(eventData);
			console.log(2, event.title, event.slug);
			expect(event).to.have.property('slug', slugify(eventData.title));
		});

		it('is unique', done => {
			console.log(1);
			const eventA = new Event(eventData);
			console.log(2);
			eventA.save(err => {
				expect(err).not.to.exist;

				console.log(3);
				const eventB = new Event(eventData);
				console.log(4);
				expect(eventA.slug).to.equal(eventB.slug);

				eventB.save(err => {
					expect(err).to.exist;
					done();
				});
			});
		});
	});

	describe('startString', () => {
		let event, eventData, start, startString;

		before(() => {
			const nextYear = new Date().getFullYear() + 1;
			start = new Date(nextYear, 3, 2, 10, 0);
			startString = `${nextYear}-04-02 10:00`;
		});

		given('we have an event', async () => {
			eventData = await factory.attrs('event', {start: () => start}, minimal);
		});

		then('gets value from start', () => {
			console.log(1);
			event = new Event(eventData);
			console.log(2);
			expect(event).to.have.property('startString', startString);
		});

		and('sets start from value', done => {
			event.start = undefined;
			expect(event.start).to.be.undefined;
			event.save(err => {
				if (err) return done(err);
				expect(event).to.have.property('start', start);
				done();
			});
		});
	});
});
