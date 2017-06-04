'use strict';

const fs = require('fs');
const gm = require('gm');
const path = require('path');
const uuid = require('uuid/v4');

const {getResourceDir} = require('../setup/files');

const imageRoot = 'images';

module.exports = handleImage;
module.exports.getImagePath = getImagePath;

function handleImage (file) {
	return new Promise(processImage.bind(null, file));
}

function processImage (file, resolve, reject) {
	if (!file) return reject('no file!');

	const id = uuid();
	const extension = path.extname(file.originalname);
	const filePath = getImagePath(id, 'original' + extension);
	const dirPath = getResourceDir(imageRoot, id);
	const writePath = getResourceDir(filePath);

	return writeDir(writeImage, () => {
		console.log('success!');
		resolve(filePath);
	});

	function writeDir (done, callback) {
		fs.mkdir(dirPath, 484, (err) => {
			if (err) return reject(err);
			done(callback);
		});
	}

	function writeImage (done) {
		gm(file.path)
			.noProfile()
			.write(writePath, (err) => {
				if (err) return rollback(err);
				cleanTemp();
				done();
			});
	}

	function rollback (imageErr) {
		fs.rmdir(dirPath);
		reject(imageErr);
	}

	function cleanTemp () {
		fs.unlink(file.path);
	}
}

function getImagePath (...pathTailFragments) {
	return path.posix.join(imageRoot, ...pathTailFragments);
}
