import { merge } from 'topojson';
import { featureCollection } from 'turf';
import flatten from '@turf/flatten';

import { districts, topoObjectName, districtSourceName } from '../constants';

export const updateHighlight = (selectedIds, activatedIds, topoJSON, map) => {
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

export const updateDistricts = (assignedDistricts, topoJSON, map) => {
	// TODO: refactor this code
	console.log('updateDistricts');
	const allGeometries = topoJSON.objects[topoObjectName].geometries;
	let geometriesByDistrict = districts.map(() => []);
	assignedDistricts.forEach((assignedDistrict, index) => {
		geometriesByDistrict[assignedDistrict].push(allGeometries[index]);
	});
	const collections = geometriesByDistrict.map(geometries => {
		return flatten(merge(topoJSON, geometries));
	});
	const geoJSON = featureCollection(
		collections
			.map((collection, index) => {
				return collection.features.map(feature => {
					return Object.assign(feature, { properties: { district: index } });
				});
			})
			.flat()
	);

	if (typeof map.getSource(districtSourceName) !== 'undefined') {
		map.getSource(districtSourceName).setData(geoJSON);
	}
};
