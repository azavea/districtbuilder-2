import { merge } from 'topojson';
import { featureCollection, area, length as turfLength } from '@turf/turf';
import flatten from '@turf/flatten';

import { districts, topoObjectName, districtSourceName } from '../constants';

export const updateHighlight = (selectedIds, activatedIds, lockedDistricts, topoJSON, map) => {
	console.log('updateHighlight');
	const allGeometries = topoJSON.objects[topoObjectName].geometries;
	const allHighlightedIds = [...new Set([...selectedIds, ...activatedIds])];
	const allHighlightedGeometries = allHighlightedIds.map(id => allGeometries[id]);
	const highlightGeoJSON = merge(topoJSON, allHighlightedGeometries);

	setTimeout(
		() => {
			map.getSource('highlight').setData(highlightGeoJSON);
		},
		selectedIds.length === 0 ? 200 : 0
	);
};

const calculateCompactnessAndContiguity = geoJSON => {
	if (geoJSON.features.length === 1) {
		var a = area(geoJSON);
		var p = turfLength(geoJSON) * 1000;
		var compactness = 4 * 3.14 * (a / (p * p));
		return compactness;
	} else {
		return -1;
	}
};

export const updateDistricts = (assignedDistricts, lockedDistricts, topoJSON, map) => {
	// TODO: refactor this code
	console.log('updateDistricts');
	const allGeometries = topoJSON.objects[topoObjectName].geometries;
	let geometriesByDistrict = districts.map(() => []);
	assignedDistricts.forEach((assignedDistrict, index) => {
		geometriesByDistrict[assignedDistrict].push(allGeometries[index]);
	});
	const collections = geometriesByDistrict.map(geometries => {
		const geoJSON = flatten(merge(topoJSON, geometries));
		const compactness = calculateCompactnessAndContiguity(geoJSON);
		return { geoJSON, compactness };
	});
	const geoJSON = featureCollection(
		collections
			.map((collection, index) => {
				return collection.geoJSON.features.map(feature => {
					return Object.assign(feature, { properties: { district: index } });
				});
			})
			.flat()
	);
	if (typeof map.getSource(districtSourceName) !== 'undefined') {
		map.getSource(districtSourceName).setData(geoJSON);
	}
	return collections.compactness;
};
