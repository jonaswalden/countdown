'use strict';

const Event = require('../../../../app/lib/models/event.model');
const factory = require('../../../helpers/factories');
const uploadFile = require('../../../helpers/upload-file');
const slugify = require('slugify');

const requiredProps = ['body', 'dateString', 'title'];
const optionalProps = ['style', 'timeString'];
const allProps = [].concat(requiredProps, optionalProps);
const autoProps = {
	title: 'slug',
	dateString: 'start',
};

describe('event model', () => {
	after(done => {
		Event.remove({}, done);
	});

	describe('full event', () => {
		let eventData;

		beforeEach(async () => {
			eventData = await factory.attrs('event');
			await uploadFile(eventData, 'style.background.image');
		});

		it('is valid', (done) => {
			const event = new Event(eventData);
			event.save(done);
		});

		it('has all expected props', () => {
			expect(Object.keys(eventData)).to.have.same.members(allProps);
		});
	});

	describe('minimal event', async () => {
		let eventData, fullEventData;

		beforeEach(async () => {
			eventData = await factory.attrs('event', {}, {minimal: true});
			fullEventData = await factory.attrs('event');
		});

		it('is valid', (done) => {
			const event = new Event(eventData);
			event.save(done);
		});

		it('has all expected props', () => {
			expect(Object.keys(eventData)).to.have.same.members(requiredProps);
		});

		allProps.forEach(prop => {
			if (requiredProps.includes(prop)) {
				it(`is invalid if required "${prop}" is missing`, done => {
					delete fullEventData[prop];
					const event = new Event(fullEventData);

					event.save(err => {
						const missingProp = autoProps[prop] || prop;
						expect(err).to.exist;
						expect(err.errors).to.exist;
						expect(err.errors).to.have.property(missingProp);
						expect(err.errors[missingProp]).to.have.property('kind', 'required');
						done();
					});
				});
			}
			else {
				it(`is still valid if optional "${prop}" is missing`, done => {
					delete fullEventData[prop];
					const event = new Event(fullEventData);
					event.save(done);
				});
			}
		});
	});

	describe('slug', () => {
		let eventData;

		beforeEach(async () => {
			eventData = await factory.attrs('event');
		});

		it('gets value from title', () => {
			const event = new Event(eventData);
			expect(eventData).to.not.have.property('slug');
			expect(event).to.have.property('slug', slugify(eventData.title).toLowerCase());
		});

		it('is unique', done => {
			const eventA = new Event(eventData);
			const eventB = new Event(eventData);

			expect(eventA.slug).to.equal(eventB.slug);

			eventA.save(aErr => {
				if (aErr) return done(aErr);

				eventB.save(bErr => {
					expect(bErr).to.exist;
					done();
				});
			});
		});
	});

	describe('start', () => {
		let eventData, startString;

		before(() => {
			const nextYear = new Date().getFullYear() + 1;
			startString = `${nextYear}-04-02 10:00`;
		});

		it('gets value from startString', async () => {
			eventData = await factory.attrs('event', {start: new Date().toJSON()});

			const event = new Event(eventData);
			expect(eventData).to.not.have.property('start');
			expect(event).to.have.property('start');
			expect(event.start.toJSON()).to.equal(new Date(startString).toJSON());
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
