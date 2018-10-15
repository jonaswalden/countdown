'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	hash: {
		type: String,
		required: true,
	},
	salt: {
		type: String,
		required: true,
	},
});

userSchema
	.virtual('passphrase')
	.set(setSaltAndHashFromPassphrase);

userSchema.methods.validatePassphrase = validatePassphrase;

module.exports = mongoose.model('User', userSchema);

function setSaltAndHashFromPassphrase (passphrase) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = getHash(this.salt, passphrase);
}

function validatePassphrase (passphrase) {
	return this.hash === getHash(this.salt, passphrase);
}

function getHash (salt, secret) {
	return crypto.pbkdf2Sync(secret, salt, 10000, 512, 'sha512').toString('hex');
}
