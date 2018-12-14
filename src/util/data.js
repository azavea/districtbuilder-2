import Flatbush from 'flatbush';
import { bbox } from 'turf';
import { bbox as turfBbox, booleanDisjoint } from '@turf/turf';

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

const spatialFilter = (rectangle, feature) => {
	// Select when geounit intersects with initial rectangle AoI
	return !booleanDisjoint(rectangle, feature);
};

const countyLimitFilter = (startCounty, currentCounty) => {
	// Select when geounit is in same county as initial geounit clicked when creating rectangle;
	if (startCounty) {
		return currentCounty === startCounty;
	} else {
		return true;
	}
};

const lockFilter = (assignedDistrict, lockedIds) => {
	// Is the geounit's assigned district currently locked?
	return !lockedIds[assignedDistrict];
};

export const spatialSearch = (
	spatialIndex,
	geoJSON,
	lockedIds,
	assignedDistricts,
	selectionLevel,
	filters
) => {
	const bbox = turfBbox(filters.rectangle);
	const results = spatialIndex.search(bbox[0], bbox[1], bbox[2], bbox[3]).map(index => {
		const feature = geoJSON.features[index];
		const id = feature.properties.id;
		const countyfp = feature.properties.countyfp;
		const assignedDistrict = assignedDistricts[id];
		if (
			// countyLimitFilter(filters.rectangleStartId, countyfp) &&
			lockFilter(assignedDistrict, lockedIds) &&
			spatialFilter(filters.rectangle, feature)
		) {
			if (selectionLevel === 'geounit') {
				return index;
			}
			if (selectionLevel === 'county') {
				return geoJSON.features[index].properties.countyfp;
			}
		}
		return undefined;
	});
	if (selectionLevel === 'geounit') {
		return results.filter(index => index !== undefined);
	}
	if (selectionLevel === 'county') {
		return [...new Set(results.filter(index => index !== undefined))];
	}
};
