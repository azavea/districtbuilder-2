import Flatbush from 'flatbush';
import { bbox } from 'turf';

import { topoObjectName } from '../constants';

export const generateIdIndex = topoJSON => {
	const geometries = topoJSON.objects[topoObjectName].geometries;
	let obj = {};
	geometries.forEach((geometry, index) => {
		obj[geometry.properties.id] = index;
	});
	return obj;
};

export const generateSpatialIndex = geojson => {
	const features = geojson.features;
	let index = new Flatbush(features.length);
	features.forEach(feature => {
		var featureBbox = bbox(feature);
		index.add(featureBbox[0], featureBbox[1], featureBbox[2], featureBbox[3]);
	});
	index.finish();
	return index;
};

export const numberWithCommas = number => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
