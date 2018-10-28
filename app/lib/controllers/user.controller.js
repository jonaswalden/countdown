'use strict';

const {Cookie} = require('tough-cookie');
const	{secret} = require('../../config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
	create,
	show,
	authenticate,
	authorize,
};

async function create (req, res, next) {
	try {
		const user = new User(Object.assign({}, req.body));
		await user.setSaltAndHashFromPassphrase(req.body.passphrase);
		await user.save();
		const token =  jwt.sign({id: user._id}, secret, {expiresIn: '1y'});
		res.cookie('id', token);
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

	const token =  jwt.sign({id: user._id}, secret, {expiresIn: '1y'});
	res.cookie('id', token);
	res.sendStatus(200);
}

function authorize (req, res, next) {
	const header = req.get('cookie');
	if (!header) return res.sendStatus(403);

	const cookie = Cookie.parse(header);
	if (cookie.key === 'id' && jwt.verify(cookie.value, secret)) return next();

	res.sendStatus(403);
}
