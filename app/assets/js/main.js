import Ticker from '../../lib/helpers/ticker';

const tickerTargets = document.getElementsByClassName('ticker');

for (let t = 0; t < tickerTargets.length; ++t) {
	initTicker(tickerTargets[t]);
}

function initTicker (element) {
	const {target, template} = element.dataset;
	const targetDate = new Date(target);

	Ticker(targetDate, template, update);

	function update (timeString) {
		element.textContent = timeString;
	}
}
