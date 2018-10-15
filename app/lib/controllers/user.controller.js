'use strict';

const User = require('../models/User');

module.exports = {
	create,
	validate,
};

async function create (req, res, next) {
	try {
		const user = new User(req.body);
		await user.save();
		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
}

async function validate (req, res, next) {
	const user = await User.findOne({name: req.body.name});
	if (!user) return res.sendStatus(401);
	if (!user.validatePassphrase(req.body.passphrase)) return res.sendStatus(401);
	res.sendStatus(200);
}
