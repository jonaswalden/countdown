'use strict';

const moment = require('moment');
const slugify = require('slugify');

const Event = require('../../../../app/lib/models/event.model');
const factory = require('../../../helpers/factories');
const uploadFile = require('../../../helpers/upload-file');

describe('event model', () => {
	const requiredProps = ['body', 'startString', 'title'];
	const optionalProps = ['style', 'backgroundImage'];
	const autoProps = ['slug', 'start'];
	const allProps = [].concat(requiredProps, optionalProps, autoProps);

	after(done => {
		Event.remove({}, done);
	});

	describe('full event', () => {
		let event, eventData;

		beforeEach(async () => {
			eventData = await EventData();
		});

		it('is valid', (done) => {
			event = new Event(eventData);

			event.save(err => {
				expect(err).not.to.exist;
				done();
			});
		});

		it('has all expected props', () => {
			expect(Object.keys(eventData)).to.have.same.members(...allProps);
		});
	});

	describe('minimal event', async () => {
		let event, eventData, fullEventData;

		beforeEach(async () => {
			eventData = await EventData({}, true);
			fullEventData = await EventData();
		});

		it('is valid', (done) => {
			event = new Event(eventData);

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
					event = new Event(fullEventData);

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
					event = new Event(fullEventData);

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
			eventData = EventData();
		});

		it('gets value from title', () => {
			delete eventData.slug;
			event = new Event(eventData);
			expect(event).to.have.property('slug', slugify(eventData.title));
		});

		it('is unique', done => {
			const eventA = new Event(eventData);

			eventA.save(err => {
				expect(err).not.to.exist;

				const eventB = new Event(eventData);
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
			startString = `${nextYear}-04-02 10:00`;
			start = moment.utc(startString).toDate();
		});

		it('gets value from start', async () => {
			eventData = await EventData({start: () => start});
			delete eventData.startSTring;

			event = new Event(eventData);
			expect(event).to.have.property('startString');
			// TODO figure out start value
		});

		it('sets value to start', async () => {
			eventData = await EventData({startString});
			delete eventData.start;

			event = new Event(eventData);
			expect(event).to.have.property('start');
			// TODO figure out dates
		});
	});
});

async function EventData (data = {}, minimal = false) {
	const opts = {minimal};
	const eventData = await factory.attrs('event', data, opts);
	await uploadFile(eventData, 'backgroundImage');
	return eventData;
}
