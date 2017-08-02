'use strict';

const parseBody = require('../../../../app/lib/helpers/parse-body');

describe('parseBody', () => {
	describe('parseMd', () => {
		it('should compile markdown to markup', () => {
			const markdown = 'yada __yada__ *yada*';
			const markup = parseBody.parseMd(markdown);
			expect(markup).to.equal('<p>yada <strong>yada</strong> <em>yada</em></p>\n');
		});
	});

	describe('parsePseudo', () => {
		it('should parse input pseudo code to handlebars code', () => {
			const pseudo = 'yada {{ticker}} yada {{ticker}} yada';
			const hbs = parseBody.parsePseudo(pseudo);
			expect(hbs).to.equal('yada {{> ticker start=start format=style.tickerFormat}} yada {{> ticker start=start format=style.tickerFormat}} yada');
		});
	});
});
