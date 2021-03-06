'use strict';

const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');

momentDurationFormatSetup(moment);

module.exports = Ticker;
module.exports.TimeLeft = TimeLeft;

function TimeLeft (targetDate, templateString) {
	const target = targetDate.getTime();
	const template = Template(templateString);
	let lastTimeLeft;

	return get;

	function get (diff) {
		const timeLeft = calculate(diff);
		return {
			time: timeLeft,
			timeString: template.compile(timeLeft)
		};
	}

	function calculate (diff) {
		if (lastTimeLeft && diff) return lastTimeLeft -= diff;

		const timeLeft = target - Date.now();
		if (!diff) return timeLeft;
		return lastTimeLeft = timeLeft;
	}
}

function Ticker (targetDate, templateString, tickCallback) {
	const template = Template(templateString);
	const getTimeLeft = TimeLeft(targetDate, template);
	const {updateFrequency} = template;
	let awaitingEvenCycle = false;
	let timer;

	start();

	return {
		start,
		stop
	};

	function start (waited) {
		const currentDate = new Date();
		const now = currentDate.getTime();
		const timeToEvenCycle = waited ? 0 : now % updateFrequency;

		if (timeToEvenCycle) {
			awaitingEvenCycle = true;
			timer = setTimeout(awaitEvenCycle, timeToEvenCycle);
			return;
		}

		timer = setInterval(update, updateFrequency);

		function awaitEvenCycle () {
			awaitingEvenCycle = false;
			update();
			start(true);
		}

		function update () {
			const {time, timeString} = getTimeLeft(timeToEvenCycle || updateFrequency);
			tickCallback(timeString);
			if (time <= 0) stop();
		}
	}

	function stop () {
		if (awaitingEvenCycle) return clearTimeout(timer);
		clearInterval(timer);
	}
}

function Template (phraseTemplate) {
	if (typeof phraseTemplate !== 'string') return phraseTemplate;
	const [units, unitTemplate] = parse();

	return {
		string: phraseTemplate,
		compile,
		updateFrequency: getUpdateFrequency()
	};

	function parse () {
		const unitPattern = /\{\{(\w+?)\}\}/g;
		const parts = [[], []];

		let match;
		while ((match = unitPattern.exec(phraseTemplate))) {
			const [occurrence, unit] = match;
			parts[0].push(occurrence);
			parts[1].push(unit);
		}

		return [parts[0], parts[1].join(' ')];
	}

	function compile (timeLeft) {
		const timeString = moment.duration(timeLeft).format(unitTemplate, {trim: false});
		const timeParts = timeString.split(' ');
		let timePhrase = phraseTemplate;

		timeParts.forEach((timePart, index) => {
			timePhrase = timePhrase.replace(units[index], timePart);
		});

		return timePhrase;
	}

	function getUpdateFrequency () {
		let smallestUnit = unitTemplate.substr(-1);
		if (smallestUnit === 'S') return 1000 / 60;
		return moment.duration(1, smallestUnit).asMilliseconds();
	}
}
