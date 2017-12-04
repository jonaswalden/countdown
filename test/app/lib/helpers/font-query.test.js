'use strict';

const fontQuery = require('../../../../app/lib/helpers/font-query');

describe('fontQuery', () => {
	describe('basic text', () => {
		const text = '' +
			'# Event name yo!\n' +
			'\n' +
			'Event description with\n' +
			'describing words and such' +
			'';

		it('combines multiple rules to a query', () => {
			const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
			const headingFont = '700 50px/1 "Merriweather", serif';

			const query = fontQuery(text, bodyFont, headingFont);

			expect(query).to.equal('family=PT%20Sans:200|Merriweather:700');
		});

		it('disregards rules not using a custom font', () => {
			const bodyFont = '200 24px/1.4 sans-serif';
			const headingFont = '700 50px/1 "Merriweather", serif';

			const query = fontQuery(text, bodyFont, headingFont);

			expect(query).to.equal('family=Merriweather:700');
		});

		it('explicitly uses weight 400 as default if combined with other variations', () => {
			const bodyFont = '24px/1.4 "PT Sans", sans-serif';
			const headingFont = '700 50px/1 "PT Sans", sans-serif';

			const query = fontQuery(text, bodyFont, headingFont);

			expect(query).to.equal('family=PT%20Sans:400,700');
		});

		it('merges multiple variations of the same family', () => {
			const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
			const headingFont = '700 50px/1 "PT Sans", sans-serif';

			const query = fontQuery(text, bodyFont, headingFont);

			expect(query).to.equal('family=PT%20Sans:200,700');
		});
	});

	describe('text with inline formatting', () => {
		const text = '' +
			'# Event _name_ __yo__!\n' +
			'\n' +
			'**Strong as phony heading**' +
			'\n' +
			'Event description with\n' +
			'*emphasized words* and such' +
			'';

		it('combines multiple rules to a query', () => {
			const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
			const headingFont = '700 50px/1 "Merriweather", serif';

			const query = fontQuery(text, bodyFont, headingFont);

			expect(query).to.equal('family=PT%20Sans:200|Merriweather:700,700italic,900');
		});

		it('disregards rules not using a custom font', () => {
			const bodyFont = '200 24px/1.4 sans-serif';
			const headingFont = '900 50px/1 "Merriweather", serif';

			const query = fontQuery(text, bodyFont, headingFont);

			expect(query).to.equal('family=Merriweather:900');
		});

		it('explicitly uses weight 400 as default if combined with other variations', () => {
			const bodyFont = '24px/1.4 "PT Sans", sans-serif';
			const headingFont = '700 50px/1 "PT Sans", sans-serif';

			const query = fontQuery(text, bodyFont, headingFont);

			expect(query).to.equal('family=PT%20Sans:400,700');
		});

		it('merges multiple variations of the same family', () => {
			const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
			const headingFont = '900 50px/1 "PT Sans", sans-serif';

			const query = fontQuery(text, bodyFont, headingFont);

			expect(query).to.equal('family=PT%20Sans:200,900');
		});
	});
});
