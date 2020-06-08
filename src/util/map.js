import { merge } from 'topojson';
import { featureCollection, area, length as turfLength } from '@turf/turf';
import flatten from '@turf/flatten';
import flat from 'array.prototype.flat';

import { topoObjectName, districtIds } from '../constants';

export const updateHighlight = (selectedIds, activatedIds, topoJSON) => {
	const allGeometries = topoJSON.objects[topoObjectName].geometries;
	const allHighlightedIds = [...new Set([...selectedIds, ...activatedIds])];
	const allHighlightedGeometries = allHighlightedIds.map(id => allGeometries[id]);
	return merge(topoJSON, allHighlightedGeometries);
};

const getGeometries = topoJSON => topoJSON.objects[topoObjectName].geometries;

const mapGeometriesToDistricts = (geometries, assignedDistricts) => {
	let geometriesByDistrict = districtIds.map(() => []);
	assignedDistricts.forEach((assignedDistrict, index) => {
		geometriesByDistrict[assignedDistrict].push(geometries[index]);
	});
	return geometriesByDistrict;
};

const getGeoJSONForEachDistrict = (assignedDistricts, topoJSON) => {
	const geometriesByDistrict = mapGeometriesToDistricts(getGeometries(topoJSON), assignedDistricts);
	return geometriesByDistrict.map(geometries => flatten(merge(topoJSON, geometries)));
};

const calculateCompactnessAndContiguity = geoJSON => {
	if (geoJSON.features.length === 1) {
		var a = area(geoJSON);
		var p = turfLength(geoJSON) * 1000;
		var compactness = 4 * 3.14 * (a / (p * p));
		return compactness;
	}
	if (geoJSON.features.length === 0) {
		return undefined;
	}
	return -1;
};

const mergeGeoJSONs = geoJSONs => {
	return featureCollection(
		flat(
			geoJSONs.map((geoJSON, index) => {
				return geoJSON.features.map(feature => {
					return Object.assign(feature, { properties: { district: index } });
				});
			})
		)
	);
};

export const getDistricts = (assignedDistricts, topoJSON) => {
	const districtGeoJSONs = getGeoJSONForEachDistrict(assignedDistricts, topoJSON);
	const districtCompactnessScores = districtGeoJSONs.map(geoJSON =>
		calculateCompactnessAndContiguity(geoJSON)
	);
	const mergedGeoJSON = mergeGeoJSONs(districtGeoJSONs);
	return { districtCompactnessScores, mergedGeoJSON };
};

// TODO: Is there a more clear way to write this?
export const generateDistrictColor = (ids, colors) => {
	return flat([
		['match', ['get', 'district']],
		...ids.map(id => {
			return [id, colors[id]];
		}),
		...['transparent'],
	]);
};

export const generateLockFilter = lockedIds => {
	return ['in', 'district'].concat(
		lockedIds.map((status, key) => (status ? key : undefined)).filter(value => value !== undefined)
	);
};

export const getOpacityExpress = property => {
	// Property must resolve to value 1, 2, or 3
	return [
		'match',
		['get', property],
		0,
		0,
		1,
		0.07,
		2,
		0.14,
		3,
		0.21,
		4,
		0.28,
		5,
		0.35,
		6,
		0.42,
		7,
		0.49,
		8,
		0.56,
		9,
		0.63,
		10,
		0.7,
		0,
	];
};
