'use strict';

const User = require('../../app/lib/models/User');
const app = require('../../app/app');
const request = require('supertest');

feature('create user', () => {
	before(() => {
		return User.remove({});
	});

	scenario('create a new user', () => {
		let createReq;
		when('credentials are posted', () => {
			createReq = request(app)
				.post('/user/')
				.send({
					name: 'janedoe',
					passphrase: 'somesecretphrase'
				});
		});

		then('user was created', () => {
			return createReq.expect(201);
		});

		let validReq;
		when('when validating user with valid credentials', () => {
			validReq = request(app)
				.post('/user/validate')
				.send({
					name: 'janedoe',
					passphrase: 'somesecretphrase'
				});
		});

		then('success', () => {
			validReq.expect(200);
		});

		let invalidReq;
		when('when validating user with invalid credentials', () => {
			invalidReq = request(app)
				.post('/user/validate')
				.send({
					name: 'janedoe',
					passphrase: 'wrongpassphrase'
				});
		});

		then('fail', () => {
			invalidReq.expect(401);
		});
	});
});
