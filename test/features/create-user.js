'use strict';

const User = require('../../app/lib/models/User');
const app = require('../../app/app');
const request = require('supertest');

feature('authentication', () => {
	scenario('create a new user', () => {
		before(() => User.remove({}));

		let response;
		when('credentials are posted', async () => {
			response = await request(app)
				.post('/user/')
				.send('name=janedoe')
				.send('passphrase=somesecretphrase');
		});

		then('user was created', () => {
			expect(response.status).to.equal(201);
		});

		when('validating matching credentials', async () => {
			response = await request(app)
				.post('/user/validate')
				.send('name=janedoe')
				.send('passphrase=somesecretphrase');
		});

		then('success', () => {
			expect(response.status).to.equal(200);
		});

		when('validating non-matching credentials', async () => {
			response = await request(app)
				.post('/user/validate')
				.send('name=janedoe')
				.send('passphrase=wrongsecretphrase');
		});

		then('fail', () => {
			expect(response.status).to.equal(401);
		});
	});
});

feature('authorization', () => {
	scenario('accepted', () => {
		before(() => User.remove({}));

		const agent = request.agent(app);
		given('an authenticated user', () => {
			return agent
				.post('/user/')
				.send('name=janedoe')
				.send('passphrase=somesecretphrase')
				.expect(201)
				.expect('set-cookie', /^id=/);
		});

		let response;
		when('visiting a route requiring authorization', async () => {
			response = await agent.get('/user/');
		});

		then('success', () => {
			expect(response.status).to.equal(200);
		});
	});

	scenario('denied', () => {
		before(() => User.remove({}));

		const agent = request.agent(app);
		given('no authenticated user', () => {
			// noop
		});

		let response;
		when('visiting a route in need of authorization', async () => {
			response = await agent.get('/user/');
		});

		then('fail', () => {
			expect(response.status).to.equal(403);
		});
	});
});
