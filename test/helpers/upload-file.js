'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const {uploadsDir} = require('../../app/lib/setup/files');
const {v4: uuid} = require('uuid');

module.exports = uploadFile;

async function uploadFile (doc, propPath) {
	const filePath = _.get(doc, propPath);
	if (!filePath) return;

	const file = await mockFile(filePath);
	_.set(doc, propPath, file.path);
}

async function mockFile (filePath) {
	const readPath = path.join(process.cwd(), filePath);
	const fileName = path.basename(readPath);
	const writePath = path.join(uploadsDir, uuid());
	try {
		await copyFile(readPath, writePath);
		return {
			originalname: fileName,
			path: writePath
		};
	}
	catch (err) {
		console.error('Error copying test image file', err);
		return null;
	}
}

function copyFile (readPath, writePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(readPath, (readErr, data) => {
			if (readErr) return reject(readErr);

			fs.writeFile(writePath, data, writeErr => {
				if (writeErr) return reject(writeErr);
				resolve();
			});
		});
	});
}
