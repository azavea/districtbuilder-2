import { combineReducers } from 'redux';
import { feature } from 'topojson';

import {
	DISTRICT_SELECTED,
	FETCH_TOPOJSON,
	GENERATE_GEOMETRIES,
	GENERATE_GEOJSON,
	GENERATE_SPATIAL_INDEX,
	GENERATE_ASSIGNED_DISTRICTS,
	SELECT_GEOUNIT,
	ACCEPT_CHANGES,
} from '../actions';

import { generateSpatialIndex } from '../util';

import { topoObjectName, districtsTemplate, districtColorsDefault } from '../constants';

const districtsReducer = () => {
	return districtsTemplate;
};

const selectedDistrictReducer = (selectedDistrict = 1, action) => {
	switch (action.type) {
		case DISTRICT_SELECTED:
			return action.payload;
		default:
			return selectedDistrict;
	}
};

const regionTopoJSONReducer = (topoJSON = null, action) => {
	switch (action.type) {
		case FETCH_TOPOJSON:
			return action.payload;
		default:
			return topoJSON;
	}
};

const districtColorsReducer = (colors = districtColorsDefault, action) => {
	switch (action.type) {
		case 'LOAD_COLORS':
			return colors;
		default:
			return colors;
	}
};

const geoJSONReducer = (geoJSON = null, action) => {
	switch (action.type) {
		case GENERATE_GEOJSON:
			return feature(action.payload, action.payload.objects[topoObjectName]);
		default:
			return geoJSON;
	}
};

const assignedDistrictsReducer = (assignedDistricts = null, action) => {
	switch (action.type) {
		case GENERATE_ASSIGNED_DISTRICTS:
			return action.payload.objects[topoObjectName].geometries.map(geometry => {
				return 0;
			});
		case ACCEPT_CHANGES:
			action.payload.selectedIds.forEach(id => {
				assignedDistricts[id] = action.payload.selectedDistrict;
			});
			// TODO: Find better way to do immutable than JSON.parse/stringify
			return JSON.parse(JSON.stringify(assignedDistricts));
		default:
			return assignedDistricts;
	}
};

const geometriesReducer = (geometries = null, action) => {
	switch (action.type) {
		case GENERATE_GEOMETRIES:
			return action.payload.objects[topoObjectName].geometries.map(geometry => {
				return Object.assign({ assignedDistrict: 0 }, geometry.properties);
			});
		default:
			return geometries;
	}
};

const selectedIdsReducer = (selectedIds = [], action) => {
	switch (action.type) {
		case SELECT_GEOUNIT:
			const idIndex = selectedIds.indexOf(action.payload);
			if (idIndex < 0) {
				return [...selectedIds, action.payload]; // Add to list
			} else {
				return [...selectedIds.slice(0, idIndex), ...selectedIds.slice(idIndex + 1)]; // Remove from list
			}
		case ACCEPT_CHANGES:
			return [];
		case DISTRICT_SELECTED:
			return [];
		default:
			return selectedIds;
	}
};

const generateSpatialIndexReducer = (geoJSON = null, action) => {
	switch (action.type) {
		case GENERATE_SPATIAL_INDEX:
			return generateSpatialIndex(action.payload);
		default:
			return geoJSON;
	}
};

export default combineReducers({
	districts: districtsReducer,
	selectedDistrict: selectedDistrictReducer,
	spatialIndex: generateSpatialIndexReducer,
	topoJSON: regionTopoJSONReducer,
	geoJSON: geoJSONReducer,
	assignedDistricts: assignedDistrictsReducer,
	selectedIds: selectedIdsReducer,
	geometries: geometriesReducer,
	districtColors: districtColorsReducer,
});
