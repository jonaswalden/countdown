const express = require('express');
const router = express.Router();
const upload = require('multer')({dest: 'uploads/'});

module.exports = router;

router.use((req, res, next) => {
	console.log('creaking, cracking');
	next();
});

const eventController = require('./controllers/event.controller');

// Event
router.get('/events/', eventController.renderAll);

router.get('/events/edit/:eventSlug/', eventController.renderEdit);
// router.post('/events/edit/:eventSlug', upload.single('background-image'), eventController.edit);

router.get('/events/create/', eventController.renderCreate);
router.post('/events/create/', upload.single('background-image'), eventController.create);

router.get('/event/:eventSlug/', eventController.renderSingle);

router.get('/event/', eventController.renderUndefinedSingle);

router.get('/seed/events/', eventController.seed);
router.get('/clear/events/', eventController.clear);

// Default
router.get('/', (req, res) => {
	res.render('pages/home');
});
