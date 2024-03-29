import { topoObjectName } from '../constants';

export const generateIdIndex = topoJSON => {
	const geometries = topoJSON.objects[topoObjectName].geometries;
	let obj = {};
	geometries.forEach((geometry, index) => {
		obj[geometry.properties.blockgroup_id] = index;
	});
	return obj;
};

export const numberWithCommas = number => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const abbreviateNumber = value => {
	var newValue = value;
	if (value >= 1000) {
		var suffixes = ['', 'k', 'm', 'b', 't'];
		var suffixNum = Math.floor(('' + value).length / 3);
		var shortValue = '';
		for (var precision = 2; precision >= 1; precision--) {
			shortValue = parseFloat(
				(suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision)
			);
			var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
			if (dotLessShortValue.length <= 2) {
				break;
			}
		}
		// if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);
		newValue = shortValue + suffixes[suffixNum];
	}
	return newValue;
};

export const booleanToOnOff = bool => {
	return bool ? 'ON' : 'OFF';
};
