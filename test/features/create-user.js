'use strict';

const User = require('../../app/lib/models/User');
const app = require('../../app/app');
const request = require('supertest');

feature('user', () => {
	scenario('new user', () => {
		before(() => User.remove({}));

		const agent = request.agent(app);
		let signUpResponse;
		when('user signs up', async () => {
			signUpResponse = await agent
				.post('/user/sign-up/')
				.send('name=janedoe')
				.send('passphrase=somesecretphrase');
		});

		then('sign up success', () => {
			expect(signUpResponse.status).to.equal(201);
		});

		let pageResponse;
		when('visiting a user-only route', async () => {
			pageResponse = await agent.get('/user/');
		});

		then('authorization success', () => {
			expect(pageResponse.status).to.equal(200);
		});
	});

	scenario('existing user', () => {
		before(() => User.remove({}));

		let user;
		given('a registered user exists', () => {
			user = new User({
				name: 'janedoe',
				passphrase: 'somesecretphrase'
			});

			return user.save();
		});

		const agent = request.agent(app);
		let signInResponse;
		when('signing in', async () => {
			signInResponse = await agent
				.post('/user/sign-in/')
				.send('name=janedoe')
				.send('passphrase=somesecretphrase');
		});

		then('authentication success', () => {
			expect(signInResponse.status).to.equal(200);
		});

		let pageResponse;
		when('visiting a user-only route', async () => {
			pageResponse = await agent.get('/user/');
		});

		then('authorization success', () => {
			expect(pageResponse.status).to.equal(200);
		});
	});
});
