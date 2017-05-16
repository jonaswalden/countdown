'use strict';

module.exports = slugify;

function slugify (title) {
	return title.toLowerCase().replace(/\s/g, '-');
}
