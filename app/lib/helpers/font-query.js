'use strict';

const familyPattern = /["'](.+?)["']/;
const weightPattern = /[1-9]00|light(?:er)?|normal|bold(?:er)?/;
const stylePattern = /italic/;
const linePattern = /^(#{1,6})?\s*(.*)/;
const symbolPattern = /([_*]{1,2})/g;

module.exports = rulesToQuery;

function rulesToQuery (text, bodyRule, headingsRule) {
	const texts = splitText(text);
	console.log(texts);
	const families = [bodyRule, headingsRule]
		.map(parseRule)
		.map(attachText)
		.filter(rule => rule)
		.map(attachInlineStyles)
		.reduce(mergeByFamily, [])
		.map(uniqueVariations)
		.map(toQueryString)
		.join('|');

	return 'family=' + families;

	function parseRule (rule) {
		if (!rule) return;

		const familyMatch = familyPattern.exec(rule);
		if (!familyMatch) return;
		const weightMatch = weightPattern.exec(rule) || [];
		const styleMatch = stylePattern.exec(rule) || [];

		return {
			family: familyMatch[1],
			weight: resolveWeight(weightMatch[0]),
			style: styleMatch[0]
		};
	}

	function attachText (rule, index) {
		const text = texts[index];
		if (!rule || !text) return;
		return Object.assign({}, rule, {text});
	}

	function attachInlineStyles (rule) {
		return {
			family: rule.family,
			text: rule.text,
			variations: bodyFontVariants(rule.text, rule.weight, rule.style)
		};
	}

	function mergeByFamily (rules, ruleA) {
		const sameFamilyRule = rules.find(ruleB => ruleA.family === ruleB.family);
		if (sameFamilyRule) {
			sameFamilyRule.variations.push(...ruleA.variations);
		}
		else {
			rules.push(ruleA);
		}

		return rules;
	}

	function uniqueVariations (rule) {
		rule.variations = rule.variations.reduce(unique, []);
		return rule;

		function unique (list, value) {
			if (!list.includes(value)) list.push(value);
			return list;
		}
	}

	function toQueryString (rule) {
		let query = encodeURIComponent(rule.family);
		const variations = rule.variations.join(',');
		if (variations) {
			query += ':' + variations;
		}

		return query;
	}
}

function splitText (text) {
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

function bodyFontVariants (text, weight, style) {
	const topContext = [weight, style];
	const {children: nodes} = parse(text);
	if (!nodes) return [topContext].reduce(toVariants, []);
	console.log('body font variants', topContext);

	return nodes
		.reduce(flatten, [[]])[0]
		.reduce(toVariants, []);

	function parse(string, tree = {}, open = null) {
		const symbolMatch = symbolPattern.exec(string);
		if (!symbolMatch) return tree;

		const [, symbol, index] = symbolMatch;
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

	function flatten ([collection, context], node) {
		const [contextWeight, contextStyle] = context || topContext;
		console.log('flattening', contextWeight);
		const isStrong = node.symbol.length === 2;
		const variant = [
			isStrong ? resolveWeight('bolder', contextWeight) : contextWeight,
			isStrong ? contextStyle : 'italic'
		];

		collection.push(variant);

		if (node.children) {
			const [childCollection] = node.children.reduce(flatten, [[], variant]);
			collection.push(...childCollection);
		}

		return [collection];
	}

	function toVariants (collection, attrs) {
		const variant = attrs.join('');
		if (variant) collection.push(variant);
		return collection;
	}
}

function resolveWeight (value = 'normal', context = 400) {
	console.log('resolving weight', value, context);
	switch (value) {
		case 'lighter': return resolveLighter();
		case 'normal': return 400;
		case 'bolder': return resolveBolder();
		default: return Number(value);
	}

	function resolveLighter () {
		if (context >= 800) return 700;
		if (context >= 600) return 400;
		return 100;
	}

	function resolveBolder () {
		if (context >= 600) return 900;
		if (context >= 400) return 700;
		return 400;
	}
}
