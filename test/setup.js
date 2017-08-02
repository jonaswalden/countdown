'use strict';

const chai = require('chai');
const spies = require('chai-spies');

const setupDatabase = require('../app/lib/setup/database');
const setupEnvironment = require('../app/lib/setup/environment');

global.chai = chai;
global.expect = chai.expect;

chai.use(spies);

setupEnvironment('test');
setupDatabase();
