'use strict';

const fontQuery = require('../../../../app/lib/helpers/font-query');

describe('fontQuery', () => {
	it('combines multiple rules to a query', () => {
		const fontA = '200 24px/1.4 "PT Sans", sans-serif';
		const fontB = '900 50px/1 "Merriweather", serif';

		const query = fontQuery(fontA, fontB);

		expect(query).to.equal('family=PT%20Sans:200|Merriweather:900');
	});

	it('disregards rules not using a custom font', () => {
		const fontA = '200 24px/1.4 sans-serif';
		const fontB = '900 50px/1 "Merriweather", serif';

		const query = fontQuery(fontA, fontB);

		expect(query).to.equal('family=Merriweather:900');
	});

	it('explicitly uses weight 400 as default if combined with other variations', () => {
		const fontA = '24px/1.4 "PT Sans", sans-serif';
		const fontB = '700 50px/1 "PT Sans", sans-serif';

		const query = fontQuery(fontA, fontB);

		expect(query).to.equal('family=PT%20Sans:400,700');
	});

	it('merges multiple variations of the same family', () => {
		const fontA = '200 24px/1.4 "PT Sans", sans-serif';
		const fontB = '900 50px/1 "PT Sans", sans-serif';
		const fontC = '50px/1 "PT Sans", sans-serif';

		const query = fontQuery(fontA, fontB, fontC);

		expect(query).to.equal('family=PT%20Sans:200,900,400');
	});
});
