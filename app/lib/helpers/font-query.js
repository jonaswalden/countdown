"use strict";

const familyPattern = /["'](.+?)["']/;
const weightPattern = /[1-9]00|light(?:er)?|normal|bold(?:er)?/;
const stylePattern = /italic/;

module.exports = rulesToQuery;

function rulesToQuery (...rules) {
	const families = rules.map(parseRule)
		.filter(font => font)
		.reduce(mergeVariations, [])
		.map(expandImplicitWeights)
		.map(toQueryString)
		.join('|');

	return 'family=' + families;

	function mergeVariations (fonts, fontA) {
		const duplicate = fonts.some(fontB => {
			if (fontA.family !== fontB.family) return;

			const [variation] = fontA.variations;
			if (!fontB.variations.includes(variation)) {
				fontB.variations.push(variation);
			}

			return true;
		});

		if (!duplicate) fonts.push(fontA);
		return fonts;
	}

	function expandImplicitWeights (font) {
		if (font.variations.length > 1) {
			font.variations = font.variations.map(v => v || '400');
		}

		return font;
	}

	function toQueryString (font) {
		const family = encodeURIComponent(font.family);
		let query = family;

		const variations = font.variations
			.filter(variation => variation)
			.join(',');

		if (variations) {
			query += ':' + variations;
		}

		return query;
	}

	function parseRule (rule) {
		if (!rule) return null;

		const familyMatch = familyPattern.exec(rule);
		if (!familyMatch) return null;

		const weightMatch = weightPattern.exec(rule);
		const styleMatch = stylePattern.exec(rule);

		const [, family] = familyMatch;
		let weightAndStyle = "";
		if (weightMatch) weightAndStyle += weightMatch[0];
		if (styleMatch) weightAndStyle += styleMatch[0];

		return {
			family,
			variations: [weightAndStyle]
		};
	}
}
