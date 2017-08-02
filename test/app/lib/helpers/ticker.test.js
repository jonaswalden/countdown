'use strict';

const ck = require('chronokinesis');

const Ticker = require('../../../../app/lib/helpers/ticker');

const {TimeLeft} = Ticker;

feature('Ticker', () => {
	let currentDate, targetDate, templateString;

	scenario('Get static time left ', () => {
		let timeLeft;

		after(() => {
			ck.reset();
		});

		given('it is 08:00 on January 1st, 2017', () => {
			currentDate = new Date(2017, 0, 1, 9);
			ck.freeze(currentDate);
		});

		and('we want to know how much time it is left to 09:00 on February 8th, 2017', () => {
			targetDate = new Date(2017, 1, 8, 10);
		});

		and('we want the output in years, weeks, months, days, hours, minutes, seconds and milliseconds', () => {
			templateString = 'Yada. {{y}} y, {{M}} M, {{w}} w, {{d}} d - {{hh}} h, {{mm}} m, {{ss}} s, {{SS}} S. Yada';
		});

		when('when we ask how much time is left', () => {
			timeLeft = TimeLeft(targetDate, templateString);
		});

		then('we get the answer in time', () => {
			const {time} = timeLeft();
			expect(time).to.equal(targetDate.getTime() - currentDate.getTime());
		});

		and('we get the answer in the desired format', () => {
			const {timeString} = timeLeft();
			expect(timeString).to.equal('Yada. 0 y, 1 M, 1 w, 1 d - 01 h, 00 m, 00 s, 00 S. Yada');
		});

		when('through the miracle of time', () => {
			currentDate.setMinutes(30);
			ck.travel(currentDate);
		});

		and('when we ask how much time is left', () => {
			timeLeft = TimeLeft(targetDate, templateString);
		});

		then('we get the updated answer in the desired format', () => {
			const {timeString} = timeLeft();
			expect(timeString).to.equal('Yada. 0 y, 1 M, 1 w, 1 d - 00 h, 30 m, 00 s, 00 S. Yada');
		});
	});

	scenario.skip('An automatic countdown', () => {
		let updateFunc;

		after(() => {
			ck.reset();
		});

		given('it is 08:00:00:0000 on January 1st, 2017', () => {
			currentDate = new Date(2017, 0, 1, 9);
			console.log(currentDate);
			ck.freeze(currentDate);
		});

		and('we want to count down to 08:00:00:0010 on the same day', () => {
			targetDate = new Date(2017, 0, 1, 9, 0, 0, 10);
			console.log(targetDate);
		});

		and('we want the output in seconds and minutes', () => {
			templateString = '{{ss}}:{{SS}} left';
		});

		when('when we start the countdown', () => {
			updateFunc = chai.spy((...args) => console.log('callback', ...args));
			Ticker(targetDate, templateString, updateFunc);
		});

		then('there has been no update', () => {
			expect(updateFunc).to.not.have.been.called();
		});

		when('1ms pass', () => {
			ck.defrost();
			setTimeout(ck.freeze, 1);
		});

		then('an update has been made with the time left as a formatted string', () => {
			expect(updateFunc).to.have.been.called.exactly(1);
			expect(updateFunc).to.have.been.called.with('00:09 left');
		});

		when('wnother 15ms pass', () => {
			ck.defrost();
			setTimeout(ck.freeze, 15);
		});

		then('another 9 updates have been made', () => {
			expect(updateFunc).to.have.been.called.exactly(10);
			expect(updateFunc).to.have.been.called.with('00:08 left');
			expect(updateFunc).to.have.been.called.with('00:07 left');
			expect(updateFunc).to.have.been.called.with('00:06 left');
			expect(updateFunc).to.have.been.called.with('00:05 left');
			expect(updateFunc).to.have.been.called.with('00:04 left');
			expect(updateFunc).to.have.been.called.with('00:03 left');
			expect(updateFunc).to.have.been.called.with('00:02 left');
			expect(updateFunc).to.have.been.called.with('00:01 left');
			expect(updateFunc).to.have.been.called.with('00:00 left');
		});
	});
});
