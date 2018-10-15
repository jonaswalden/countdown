'use strict';

const {uploadsDir} = require('../../app/lib/setup/files');
const fs = require('fs');
const logger = require('../../app/lib/setup/logger');
const path = require('path');
const uuid = require('uuid/v4');

module.exports = uploadFile;

async function uploadFile (doc, propName) {
	const filePath = doc[propName];
	if (!filePath) return;
	const file = await mockFile(filePath);
	doc[propName] = file;
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
		logger.error('Error copying test image file', err);
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
