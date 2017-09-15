'use strict';

const emPattern = /\*{1}(.*?)\*{1}/g;
const linePattern = /^(#{1,6})?\s*(.*)/;
const strongPattern = /\*{2}.*?\*{2}/g;

function bodyFontVariants (text, bodyVariants, headingVariants) {
	const [bodyText, headingText] = text.split('\n').reduce(filterLines, ['', '']);

	if (bodyVariants) addInlineStyles(bodyText, bodyVariants);
	if (headingVariants) addInlineStyles(headingText, headingVariants);

	function filterLines (texts, line) {
		if (!line) return texts;

		const [, headingType, content] = linePattern.exec(line);
		const typeIndex = +!!headingType;
		texts[typeIndex] += content;

		return texts;
	}

	function addInlineStyles (text, variants) {
		if (text.match(strongPattern)) {
			variants.push(700);
		}

		if (text.match(emPattern)) {
			variants.push('italic');
		}
	}
}

it('dev', () => {
	 const body = '# i am *a* heading\n\ni am in the **body**';
	const bodyVariants = [];
	const headingVariants = [];
	bodyFontVariants(body, bodyVariants, headingVariants);
	expect(bodyVariants).to.contain(700);
	expect(headingVariants).to.contain('italic');
});

describe.skip('bodyFontVariants', () => {
	it('finds no varations', () => {
		const body = 'text text';
		expect(bodyFontVariants(body)).to.have.members([]);
	});

	it('finds **strong**', () => {
		const body = 'text **strong text** text';
		expect(bodyFontVariants(body)).to.have.members([200]);
	});
});
