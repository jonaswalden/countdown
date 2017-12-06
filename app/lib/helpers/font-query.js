'use strict';

const familyPattern = /["'](.+?)["']/;
const weightPattern = /[1-9]00|light(?:er)?|normal|bold(?:er)?/;
const stylePattern = /italic/;
const linePattern = /^(#{1,6})?\s*(.*)/;
const symbolPattern = /(_{1,2}|\*{1,2})/g;

module.exports = rulesToQuery;

function rulesToQuery (text, bodyRule, headingsRule) {
	const texts = splitText(text);
	if (!texts.some(t => t)) return null;

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
			variations: getFontVariations(rule.text, rule.weight, rule.style)
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
		return encodeURIComponent(rule.family) + ':' + rule.variations.join(',');
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

function getFontVariations (text, weight, style) {
	const topContext = [weight, style];
	const {children: nodes} = parse(text);
	const variations = [topContext];
	if (nodes) {
		variations.push(...nodes.reduce(flatten, [[]])[0]);
	}

	return variations.map(toString);

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

	function toString (attrs) {
		return attrs.join('');
	}
}

function resolveWeight (value = 'normal', context = 400) {
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
