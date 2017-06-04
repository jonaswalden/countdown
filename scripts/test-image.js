'use strict';

const handleImage = require('../app/lib/helpers/handle-image');

test();

async function test () {
	const file = {
		path: 'C:\\dev\\countdown\\ssr\\resources\\uploads\\user-image.jpg',
		originalname: 'user-image.jpg'
	};

	try {
		const resourceId = await handleImage(file);
		console.log('success', resourceId);
	}
	catch (err) {
		console.error(err);
	}
}
