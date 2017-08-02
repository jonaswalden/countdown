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
	attrs.startString = `${nextYear}-04-02 10:00`;
	attrs.title = `Event No ${eventCount}`;

	if (buildOptions.minimal) return attrs;

	// attrs.slug = `event-${eventCount}`;
	attrs.style = {};
	attrs.style.background = {color: 'black'};
	attrs.style.text = {color: 'white'};
	attrs.style.tickerFormat = '{{hh}}:{{mm}}';
	attrs.backgroundImage = './test/data/test-image.jpg';

	return attrs;
});

module.exports = factory;
