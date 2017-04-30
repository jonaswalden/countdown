'use strict';

const Factory = require('factory-lady');

const Event = require('../../app/lib/models/event.model');

let eventCounter = 0;

Factory.define('event', Event, ((eventCount) => {
	return {
		background: {
			image: '/path/to/image.jpg'
		},
		body: {
			md: `
				# {{title}}

				content content content
			`,
			html: `
				<h1>Event No ${eventCount}</h1>
				<p>content content content</p>
			`
		},
		slug: `event-no-${eventCount}`,
		start: {
			dateTime: new Date('2001-01-01 01:01'),
			dateTimeString: '2001-01-01 01:01',
			format: 'hh:mm'
		},
		textColor: 'black',
		title: `Event No ${eventCount}`
	};
})(++eventCounter));

module.exports = Factory;
