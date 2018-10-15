'use strict';

const fontQuery = require('../../../../app/lib/helpers/font-query');

describe('fontQuery', () => {
	const basicText = '' +
		'# Event name yo!\n' +
		'\n' +
		'Event description with\n' +
		'describing words and such';

	it('combines multiple rules to a query', () => {
		const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
		const headingFont = '700 50px/1 "Merriweather", serif';

		const query = fontQuery(basicText, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:200|Merriweather:700');
	});

	it('disregards rules not using a custom font', () => {
		const bodyFont = '200 24px/1.4 sans-serif';
		const headingFont = '700 50px/1 "Merriweather", serif';

		const query = fontQuery(basicText, bodyFont, headingFont);

		expect(query).to.equal('family=Merriweather:700');
	});

	it('explicitly uses weight 400 as default weight', () => {
		const bodyFont = '24px/1.4 "PT Sans", sans-serif';
		const headingFont = '50px/1 "Merriweather", sans-serif';

		const query = fontQuery(basicText, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:400|Merriweather:400');
	});

	it('merges multiple variations of the same family', () => {
		const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
		const headingFont = '700 50px/1 "PT Sans", sans-serif';

		const query = fontQuery(basicText, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:200,700');
	});

	it('merges same variations across rules ', () => {
		const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
		const headingFont = '200 50px/1 "PT Sans", sans-serif';

		const query = fontQuery(basicText, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:200');
	});

	it('doesn\'t request body font if it isn\'t used', () => {
		const textWithOnlyHeadings = '# top headingn\n\n## sub heading';
		const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
		const headingFont = '900 50px/1 "Merriweather", sans-serif';

		const query = fontQuery(textWithOnlyHeadings, bodyFont, headingFont);

		expect(query).to.equal('family=Merriweather:900');
	});

	it('doesn\'t request heading font if it isn\'t used', () => {
		const textWithNoHeadings = 'body text\n\nand more body text';
		const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
		const headingFont = '900 50px/1 "Merriweather", sans-serif';

		const query = fontQuery(textWithNoHeadings, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:200');
	});

	it('no request if text has no content', () => {
		const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
		const headingFont = '900 50px/1 "Merriweather", sans-serif';

		const query = fontQuery('', bodyFont, headingFont);

		expect(query).to.equal(null);
	});

	it('no request if no font rules', () => {
		const query = fontQuery(basicText, '', undefined);

		expect(query).to.equal(null);
	});

	const formattedText = '' +
		'# Event _name_ __yo__!\n' +
		'\n' +
		'**Strong as phony heading**' +
		'\n' +
		'Event description with\n' +
		'*emphasized words* and such';

	it('combines multiple rules to a query', () => {
		const bodyFont = '200 24px/1.4 "PT Sans", sans-serif';
		const headingFont = '700 50px/1 "Merriweather", serif';

		const query = fontQuery(formattedText, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:200,400,200italic|Merriweather:700,700italic,900');
	});

	it('disregards rules not using a custom font', () => {
		const bodyFont = '200 24px/1.4 sans-serif';
		const headingFont = '100 50px/1 "Merriweather", serif';

		const query = fontQuery(formattedText, bodyFont, headingFont);

		expect(query).to.equal('family=Merriweather:100,100italic,400');
	});

	it('merging variations of same family into single query', () => {
		const bodyFont = '24px/1.4 "PT Sans", sans-serif';
		const headingFont = '700 50px/1 "PT Sans", sans-serif';

		const query = fontQuery(formattedText, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:400,700,400italic,700italic,900');
	});

	it('doesn\'t merge tokens from the end and beginning of adjacent lines', () => {
		const text = '*yada*\n*yada*\n*yada*';
		const bodyFont = '400 24px/1.4 "PT Sans", sans-serif';
		const headingFont = '400 60px/1 sans-serif';

		const query = fontQuery(text, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:400,400italic');
	});

	it.skip('doesn\'t request variations with no direct content', () => {
		const text = '_**strong italic text**_';
		const bodyFont = '24px/1.4 "PT Sans", sans-serif';
		const headingFont = '50px sans-serif';

		const query = fontQuery(text, bodyFont, headingFont);

		expect(query).to.equal('family=PT%20Sans:700italic');
	});

	it.skip('requests variations only with glyphs used');
});
