'use strict';

const {factory} = require('factory-girl');

const Event = require('../../app/lib/models/event.model');

factory.define('event', Event, buildOptions => {
	const eventCount = factory.seq('Event.id', n => n)();
	const nextYear = new Date().getFullYear() + 1;
	const attrs = {};

	attrs.body = `
		# {{title}}

		content content content

		{{ticker}}
	`;
	attrs.start = () => new Date(nextYear, 3, 2, 10, 0);
	attrs.title = `Event No ${eventCount}`;

	if (buildOptions.minimal) return attrs;

	attrs.slug = `event-${eventCount}`;
	attrs.style = {};
	attrs.style.background = {
		image: './test/data/test-image.jpg',
		color: 'black'
	};
	attrs.style.text = {
		color: 'white'
	};
	attrs.style.tickerFormat = 'HH:mm';

	return attrs;
});

module.exports = factory;
