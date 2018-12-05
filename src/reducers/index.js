import { combineReducers } from 'redux';
import { feature } from 'topojson';
import { bbox as turfBbox, booleanDisjoint } from '@turf/turf';

import {
	DISTRICT_SELECTED,
	FETCH_TOPOJSON,
	GENERATE_GEOMETRIES,
	GENERATE_GEOJSON,
	GENERATE_SPATIAL_INDEX,
	GENERATE_ASSIGNED_DISTRICTS,
	SELECT_GEOUNIT,
	ACCEPT_CHANGES,
	CHANGE_DRAWMODE,
	RECTANGLE_SELECT,
	RECTANGLE_ACTIVATE,
	RECTANGLE_START,
} from '../actions';

import { generateSpatialIndex } from '../util';

import { topoObjectName, districtColors } from '../constants';

const selectedDistrictReducer = (selectedDistrict = 1, { type, payload }) => {
	switch (type) {
		case DISTRICT_SELECTED:
			return payload;
		default:
			return selectedDistrict;
	}
};

const regionTopoJSONReducer = (topoJSON = null, { type, payload }) => {
	switch (type) {
		case FETCH_TOPOJSON:
			return payload;
		default:
			return topoJSON;
	}
};

const districtColorsReducer = (colors = districtColors, { type, payload }) => {
	switch (type) {
		case 'LOAD_COLORS':
			return colors;
		default:
			return colors;
	}
};

const geoJSONReducer = (geoJSON = null, { type, payload }) => {
	switch (type) {
		case GENERATE_GEOJSON:
			return feature(payload, payload.objects[topoObjectName]);
		default:
			return geoJSON;
	}
};

const assignedDistrictsReducer = (assignedDistricts = null, { type, payload }) => {
	switch (type) {
		case GENERATE_ASSIGNED_DISTRICTS:
			return payload.objects[topoObjectName].geometries.map(geometry => {
				return 0;
			});
		case ACCEPT_CHANGES:
			payload.selectedIds.forEach(id => {
				assignedDistricts[id] = payload.selectedDistrict;
			});
			return JSON.parse(JSON.stringify(assignedDistricts));
		default:
			return assignedDistricts;
	}
};

const geometriesReducer = (geometries = null, { type, payload }) => {
	switch (type) {
		case GENERATE_GEOMETRIES:
			return payload.objects[topoObjectName].geometries.map(geometry => {
				return Object.assign({ assignedDistrict: 0 }, geometry.properties);
			});
		default:
			return geometries;
	}
};

const rectangleStartReducer = (countyfp = null, { type, payload }) => {
	switch (type) {
		case RECTANGLE_START:
			return payload;
		default:
			return countyfp;
	}
};

const activatedIdsReducer = (selectedIds = [], { type, payload }) => {
	switch (type) {
		case RECTANGLE_ACTIVATE:
			const bbox = turfBbox(payload.rectangle);

			// console.log('Start');
			const activatedIds = payload.spatialIndex
				.search(bbox[0], bbox[1], bbox[2], bbox[3])
				.map(index => {
					// console.log(payload.geoJSON.features[index].properties.countyfp);
					if (!booleanDisjoint(payload.rectangle, payload.geoJSON.features[index])) {
						return index;
					}
				})
				.filter(index => {
					return index;
				});
			return activatedIds;
		case RECTANGLE_SELECT:
			return [];
		case ACCEPT_CHANGES:
			return [];
		default:
			return selectedIds;
	}
};

const selectedIdsReducer = (selectedIds = [], { type, payload }) => {
	switch (type) {
		case SELECT_GEOUNIT:
			console.log(selectedIds);
			const idIndex = selectedIds.indexOf(payload);
			if (idIndex < 0) {
				return [...selectedIds, payload]; // Add to list
			} else {
				return [...selectedIds.slice(0, idIndex), ...selectedIds.slice(idIndex + 1)]; // Remove from list
			}
		case RECTANGLE_SELECT:
			const bbox = turfBbox(payload.rectangle);

			const features = payload.spatialIndex
				.search(bbox[0], bbox[1], bbox[2], bbox[3])
				.map(i => {
					// console.log(payload.geoJSON.features[i]);
					return payload.geoJSON.features[i];
				})
				.filter(feature => !booleanDisjoint(payload.rectangle, feature));

			const collected = [
				...new Set([...selectedIds, ...features.map(feature => feature.properties.id)]),
			];
			return collected;

		case ACCEPT_CHANGES:
			return [];
		default:
			return selectedIds;
	}
};

const generateSpatialIndexReducer = (geoJSON = null, { type, payload }) => {
	switch (type) {
		case GENERATE_SPATIAL_INDEX:
			return generateSpatialIndex(payload);
		default:
			return geoJSON;
	}
};

const drawModeReducer = (mode = 'Rectangle', { type, payload }) => {
	switch (type) {
		case CHANGE_DRAWMODE:
			return payload;
		default:
			return mode;
	}
};

export default combineReducers({
	selectedDistrict: selectedDistrictReducer,
	spatialIndex: generateSpatialIndexReducer,
	topoJSON: regionTopoJSONReducer,
	geoJSON: geoJSONReducer,
	assignedDistricts: assignedDistrictsReducer,
	selectedIds: selectedIdsReducer,
	activatedIds: activatedIdsReducer,
	geometries: geometriesReducer,
	districtColors: districtColorsReducer,
	drawMode: drawModeReducer,
	rectangleStart: rectangleStartReducer,
});
