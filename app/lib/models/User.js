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

userSchema.methods.setSaltAndHashFromPassphrase = setSaltAndHashFromPassphrase;
userSchema.methods.validatePassphrase = validatePassphrase;

module.exports = mongoose.model('User', userSchema);

async function setSaltAndHashFromPassphrase (passphrase) {
	this.salt = await bcrypt.genSalt(10);
	this.hash = await bcrypt.hash(passphrase, this.salt);
}

function validatePassphrase (passphrase) {
	return bcrypt.compare(passphrase, this.salt);
}
