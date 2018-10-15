'use strict';

const parseBody = require('../../../../app/lib/helpers/parse-body');

describe('parseBody', () => {
	it('should compile markdown to markup', () => {
		const markup = parseBody(
			'# {{title}}\n' +
			'\n' +
			'{{ticker}}\n' +
			'\n' +
			'yada **yada** _yada_\n' +
			'yada\n' +
			'\n'+
			'## Heading level 2'
		);
		expect(markup).to.equal(
			'<h1>{{title}}</h1>' +
			'<p>{{> ticker start=start format=style.tickerFormat}}</p>\n'+
			'<p>yada <strong>yada</strong> <em>yada</em><br>yada</p>\n' +
			'<h2>Heading level 2</h2>'
		);
	});
});
