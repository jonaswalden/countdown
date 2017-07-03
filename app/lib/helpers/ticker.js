'use strict';

const moment = require('moment');

require('moment-duration-format');

module.exports = Ticker;
module.exports.TimeLeft = TimeLeft;

function TimeLeft (targetDate, templateString) {
	const target = targetDate.getTime();
	const template = Template(templateString);

	return get;

	function get () {
		const timeLeft = target - Date.now();
		return {
			timeLeft,
			timeLeftString: template.compile(timeLeft)
		};
	}
}

function Ticker (targetDate, templateString, tickCallback) {
	const template = Template(templateString);
	const getTimeLeft = TimeLeft(targetDate, template);
	let timer;

	return {
		start,
		stop
	};

	function start () {
		timer = setInterval(() => {
			const {timeLeft, timeLeftString} = getTimeLeft();
			tickCallback(timeLeftString);
			if (!timeLeft) stop();
		}, template.smallestUnit);
	}

	function stop () {
		clearInterval(timer);
	}
}

function Template (phraseTemplate) {
	if (typeof phraseTemplate !== 'string') return phraseTemplate;
	const [units, unitTemplate] = parse();

	return {
		string: phraseTemplate,
		smallestUnit: unitTemplate.substr(-1),
		compile
	};

	function parse () {
		const unitPattern = /\{\{(.+)\}\}/g;
		const list = [];
		let string = '';

		let match;
		while ((match = unitPattern.exec(phraseTemplate))) {
			const [occurrence, unit] = match;
			list.push(occurrence);
			string = string ? `${string}  ${unit}` : unit;
		}

		return [list, string];
	}

	function compile (timeLeft) {
		const timeParts = moment.duration(timeLeft).format(unitTemplate).split(' ');
		let timeString = phraseTemplate;

		timeParts.forEach((timePart, index) => {
			timeString = timeString.replace(units[index], timePart);
		});

		return timeString;
	}
}
