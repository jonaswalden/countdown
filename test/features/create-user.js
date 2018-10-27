'use strict';

const User = require('../../app/lib/models/User');
const app = require('../../app/app');
const supertest = require('supertest');

feature('user', () => {
	scenario('new user', () => {
		before(() => User.remove({}));

		let request, signUpResponse;
		when('user signs up', async () => {
			request = supertest.agent(app);
			signUpResponse = await request
				.post('/user/sign-up/')
				.send('name=janedoe')
				.send('passphrase=somesecretphrase');
		});

		then('sign up success', () => {
			expect(signUpResponse.status).to.equal(201);
		});

		let pageResponse;
		when('visiting a user-only route', async () => {
			pageResponse = await request.get('/user/');
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

		let request, signInResponse;
		when('signing in', async () => {
			request = supertest.agent(app);
			signInResponse = await request
				.post('/user/sign-in/')
				.send('name=janedoe')
				.send('passphrase=somesecretphrase');
		});

		then('authentication success', () => {
			expect(signInResponse.status).to.equal(200);
		});

		let pageResponse;
		when('visiting a user-only route', async () => {
			pageResponse = await request.get('/user/');
		});

		then('authorization success', () => {
			expect(pageResponse.status).to.equal(200);
		});
	});

	scenario('non-registered user', () => {
		let pageResponse;
		when('visiting a user-only route', async () => {
			const request = supertest(app);
			pageResponse = await request.get('/user/');
		});

		then('authorization fail', () => {
			expect(pageResponse.status).to.equal(403);
		});
	});
});
