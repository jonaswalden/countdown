'use strict';

const chai = require('chai');
const mongoose = require('mongoose');

// mongoose.set('debug', true);
const setupDatabase = require('../app/lib/setup/database');
const setupEnvironment = require('../app/lib/setup/environment');

global.expect = chai.expect;

setupEnvironment('test');
setupDatabase();
