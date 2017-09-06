'use strict';

const {factory} = require('factory-girl');

const Event = require('../../app/lib/models/event.model');

factory.define('event', Event, buildOptions => {
	const eventCount = factory.seq('Event.id', n => n)();
	const nextYear = new Date().getFullYear() + 1;
	const attrs = {};

	attrs.body = '' +
		'# {{title}}\n' +
		'\n' +
		'content content content\n' +
		'\n' +
		'{{ticker}}';
	attrs.startString = `${nextYear}-04-02 10:00`;
	attrs.title = `Event No ${eventCount}`;

	if (buildOptions.minimal) return attrs;

	attrs.style = {};

	attrs.style.text = {};
	attrs.style.text.color = 'white';
	attrs.style.text.fontBody = '20px sans-serif';
	attrs.style.text.fontHeading = '36px serif';

	attrs.style.tickerFormat = '{{hh}}:{{mm}}';

	attrs.style.background = {};
	attrs.style.background.color = 'black';
	attrs.style.background.image = './test/data/test-image.jpg';

	return attrs;
});

module.exports = factory;
