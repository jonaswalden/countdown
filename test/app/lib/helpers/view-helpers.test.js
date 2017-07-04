'use strict';

const viewHelpers = require('../../../../app/lib/helpers/handlebars');

describe('dateTime', () => {
	const {dateTime} = viewHelpers;

	it('renders time left in the supplied format', () => {
		const start = new Date(Date.now() + (2.5 * 60 * 60 * 1000));
		const timeLeft = dateTime(start, 'HH:mm');
		expect(timeLeft).to.equal('2:30');
	});
});
