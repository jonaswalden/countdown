'use strict';

const ck = require('chronokinesis');

const viewHelpers = require('../../../../app/lib/helpers/view-helpers');

describe('timeLeft', () => {
	before(ck.freeze);
	after(ck.reset);

	const {timeLeft} = viewHelpers;

	it('renders time left in the supplied format', () => {
		const timeDifference = (2.5 * 60 * 60 * 1000);
		const start = new Date(Date.now() + timeDifference);
		const timeString = timeLeft(start, '{{hh}}:{{mm}}');
		expect(timeString).to.equal('02:30');
	});
});
