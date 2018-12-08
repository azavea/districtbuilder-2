import { merge } from 'topojson';
import { featureCollection, area, length as turfLength } from '@turf/turf';
import flatten from '@turf/flatten';

import { topoObjectName } from '../constants';

export const updateHighlight = (selectedIds, activatedIds, lockedDistricts, topoJSON, map) => {
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

const getGeometries = topoJSON => topoJSON.objects[topoObjectName].geometries;

const mapGeometriesToDistricts = (geometries, assignedDistricts) => {
	let geometriesByDistrict = assignedDistricts.map(() => []);
	assignedDistricts.forEach((assignedDistrict, index) => {
		geometriesByDistrict[assignedDistrict].push(geometries[index]);
	});
	return geometriesByDistrict;
};

const getGeoJSONForEachDistrict = (assignedDistricts, topoJSON) => {
	const geometriesByDistrict = mapGeometriesToDistricts(
		getGeometries(topoJSON),
		assignedDistricts
	);
	return geometriesByDistrict.map(geometries => flatten(merge(topoJSON, geometries)));
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

const mergeGeoJSONs = geoJSONs => {
	return featureCollection(
		geoJSONs
			.map((geoJSON, index) => {
				return geoJSON.features.map(feature => {
					return Object.assign(feature, { properties: { district: index } });
				});
			})
			.flat()
	);
};

export const getDistricts = (assignedDistricts, lockedDistricts, topoJSON) => {
	const districtGeoJSONs = getGeoJSONForEachDistrict(assignedDistricts, topoJSON);
	const districtCompactnessScores = districtGeoJSONs.map(geoJSON =>
		calculateCompactnessAndContiguity(geoJSON)
	);
	const mergedGeoJSON = mergeGeoJSONs(districtGeoJSONs);
	return { districtGeoJSONs, districtCompactnessScores, mergedGeoJSON };
};
