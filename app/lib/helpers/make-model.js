'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = makeModel;

function makeModel (name, schema) {
	return mongoose.model(name, new Schema(schema));
}
