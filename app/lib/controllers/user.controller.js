'use strict';

const User = require('../models/User');
const {Cookie} = require('tough-cookie');

module.exports = {
	create,
	show,
	authenticate,
	authorize,
};

async function create (req, res, next) {
	try {
		const user = new User(Object.assign({}, req.body));
		await user.save();
		res.cookie('id', 1);
		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
}

async function show (req, res) {
	res.sendStatus(200);
}

async function authenticate (req, res) {
	const user = await User.findOne({name: req.body.name});
	if (!user) return res.sendStatus(401);
	if (!user.validatePassphrase(req.body.passphrase)) return res.sendStatus(401);

	res.cookie('id', 1);
	res.sendStatus(200);
}

function authorize (req, res, next) {
	const header = req.get('cookie');
	if (!header) return res.sendStatus(403);

	const cookie = Cookie.parse(header);
	if (cookie.key === 'id' && cookie.value === '1') return next();

	res.sendStatus(403);
}
