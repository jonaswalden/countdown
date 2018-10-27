'use strict';

const bcrypt = require('bcrypt');
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
	this.salt = bcrypt.genSaltSync(10);
	this.hash = bcrypt.hashSync(passphrase, this.salt);
}

function validatePassphrase (passphrase) {
	return bcrypt.compare(passphrase, this.salt);
}
