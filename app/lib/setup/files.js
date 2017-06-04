'use strict';

const multer = require('multer');
const path = require('path');

const resourceDir = path.join(process.cwd(), 'resources');
const uploadsDir = path.join(resourceDir, 'uploads');
const storage = multer.diskStorage({
	destination: uploadsDir
});

const middleware = multer({storage});

module.exports = middleware;
module.exports.getResourceDir = getResourceDir;

function getResourceDir (...paths) {
	return path.join(resourceDir, ...paths);
}
