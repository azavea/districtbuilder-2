import { topoObjectName } from '../constants';

export const generateIdIndex = topoJSON => {
	const geometries = topoJSON.objects[topoObjectName].geometries;
	let obj = {};
	geometries.forEach((geometry, index) => {
		obj[geometry.properties.id] = index;
	});
	return obj;
};

export const numberWithCommas = number => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
