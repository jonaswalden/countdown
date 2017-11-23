'use strict';

const linePattern = /^(#{1,6})?\s*(.*)/;
const symbolPattern = /([_*]{1,2})/g;


function filterText (text) {
	return text.split('\n').reduce(filterLines, ['', '']);

	function filterLines (texts, line) {
		if (!line) return texts;

		const lineMatch = linePattern.exec(line);
		const [, headingType, content] = lineMatch;
		const typeIndex = +!!headingType;
		texts[typeIndex] += content;

		return texts;
	}
}

function bodyFontVariants (text, context) {
	if (!text || !context) return;

	const {children: nodes} = parse(text);
	if (!nodes) return [context].reduce(toVariants, []);

	return nodes
		.reduce(flatten, [[], context])[0]
		.reduce(toVariants, []);

	function parse(string, tree = {}, open = null) {
		const symbolMatch = symbolPattern.exec(string);
		if (!symbolMatch) return tree;

		const [, symbol, index] = symbolMatch;
		console.log('>', symbol);
		const closing = symbol === open;
		const substring = string.substr(index + symbol.length);

		if (closing) {
			const parent = tree.parent || tree;
			delete tree.parent;
			return parse(substring, parent, parent.symbol);
		}

		tree.children = tree.children || [];
		const subtree = {symbol, parent: tree};
		tree.children.push(subtree);

		return parse(substring, subtree, symbol);
	}

	function flatten ([collection, [contextWeight, contextStyle]], node) {
		const isStrong = node.symbol.length === 2;
		const variant = [
			isStrong ? resolveStrongWeight(contextWeight) : contextWeight,
			isStrong ? contextStyle : 'italic'
		];

		collection.push(variant);

		if (node.children) {
			const [childCollection] = node.children.reduce(flatten, [[], variant]);
			collection.push(...childCollection);
		}

		return [collection, []];
	}

	function toVariants (collection, attrs) {
		const variant = attrs.filter(a => a).join('');
		if (!variant) return collection;
		if (collection.includes(variant)) return collection;

		collection.push(variant);
		return collection;
	}
}

function resolveStrongWeight (context = 400) {
	if (context >= 600) return 900;
	if (context >= 400) return 700;
	return 400;
}

describe('filterText', () => {
	it('splits text into heading text and body text', () => {
		const [bodyText, headingText] = filterText('# h1\n\nb1\n\nb2\n\n## h2\n\nb3\n\n### h3');
		expect(bodyText).to.equal('b1b2b3');
		expect(headingText).to.equal('h1h2h3');
	});
});

describe('bodyFontVariants', () => {
	it('finds no varations', () => {
		const text = 'text text';
		const variants = bodyFontVariants(text, []);
		expect(variants).to.eql([]);
	});

	it('finds *em*', () => {
		const text = 'text *emphasized text* text';
		const variants = bodyFontVariants(text, []);
		expect(variants).to.eql(['italic']);
	});

	it('finds **strong**', () => {
		const text = 'text **strong text** text';
		const variants = bodyFontVariants(text, []);
		expect(variants).to.eql(['700']);
	});

	it('finds *em* in **strong**', () => {
		const text = 'text **strong *and emphasizes* text** text';
		const variants = bodyFontVariants(text, []);
		expect(variants).to.eql(['700', '700italic']);
	});

	it('finds **strong** in *em*', () => {
		const text = 'text *emphasizes **and strong** text* text';
		const variants = bodyFontVariants(text, []);
		expect(variants).to.eql(['italic', '700italic']);
	});

	it.skip('finds *em* directly in **strong**', () => {
		const text = 'text ***strong and emphasizes *** text';
		const variants = bodyFontVariants(text, []);
		expect(variants).to.eql(['italic', '700italic']);
	});

	describe('bold context', () => {
		it('finds no additional varations', () => {
			const text = 'text text';
			const variants = bodyFontVariants(text, [700]);
			expect(variants).to.eql(['700']);
		});

		it('finds *em*', () => {
			const text = 'text *emphasized text* text';
			const variants = bodyFontVariants(text, [700]);
			expect(variants).to.eql(['700italic']);
		});

		it('finds **strong**', () => {
			const text = 'text **strong text** text';
			const variants = bodyFontVariants(text, [700]);
			expect(variants).to.eql(['900']);
		});

		it('finds *em* in **strong**', () => {
			const text = 'text **strong *and emphasizes* text** text';
			const variants = bodyFontVariants(text, [700]);
			expect(variants).to.eql(['900', '900italic']);
		});
	});

	describe('100 context', () => {
		it('finds no additional varations', () => {
			const text = 'text text';
			const variants = bodyFontVariants(text, [100]);
			expect(variants).to.eql(['100']);
		});

		it('finds *em*', () => {
			const text = 'text *emphasized text* text';
			const variants = bodyFontVariants(text, [100]);
			expect(variants).to.eql(['100italic']);
		});

		it('finds **strong**', () => {
			const text = 'text **strong text** text';
			const variants = bodyFontVariants(text, [100]);
			expect(variants).to.eql(['400']);
		});

		it('finds **strong in __strong__**', () => {
			const text = 'text **strong text __and even stronger text__** text';
			const variants = bodyFontVariants(text, [100]);
			expect(variants).to.eql(['400', '700']);
		});

		it('finds *em* in **strong**', () => {
			const text = 'text **strong *and emphasizes* text** text';
			const variants = bodyFontVariants(text, [100]);
			expect(variants).to.eql(['400', '400italic']);
		});
	});

	describe('italic context', () => {
		it('finds no additional varations', () => {
			const text = 'text text';
			const variants = bodyFontVariants(text, [undefined, 'italic']);
			expect(variants).to.eql(['italic']);
		});

		it('finds *em*', () => {
			const text = 'text *emphasized text* text';
			const variants = bodyFontVariants(text, [undefined, 'italic']);
			expect(variants).to.eql(['italic']);
		});

		it('finds **strong**', () => {
			const text = 'text **strong text** text';
			const variants = bodyFontVariants(text, [undefined, 'italic']);
			expect(variants).to.eql(['700italic']);
		});

		it('finds *em* in **strong**', () => {
			const text = 'text **strong *and emphasizes* text** text';
			const variants = bodyFontVariants(text, [undefined, 'italic']);
			expect(variants).to.eql(['700italic']);
		});
	});
});
