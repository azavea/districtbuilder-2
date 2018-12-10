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
	RECTANGLE_SELECT,
	RECTANGLE_ACTIVATE,
	RECTANGLE_START,
	LOCK_DISTRICT,
} from '../actions';

import { generateSpatialIndex, spatialSearch, getDistricts } from '../util';

import { topoObjectName, districtColors, lockedIdsTemplate } from '../constants';

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

const addSelectedDistrictsToAssignedList = (assignedDistricts, selectedIds, selectedDistrict) => {
	selectedIds.forEach(id => {
		assignedDistricts[id] = selectedDistrict;
	});
	return JSON.parse(JSON.stringify(assignedDistricts));
};

const assignedDistrictsReducer = (districts = null, { type, payload }) => {
	switch (type) {
		case GENERATE_ASSIGNED_DISTRICTS:
			const assignedInitial = payload.topoJSON.objects[topoObjectName].geometries.map(
				geometry => {
					return 0;
				}
			);
			const geometryInitial = getDistricts(
				assignedInitial,
				payload.lockedDistricts,
				payload.topoJSON
			);
			return {
				assigned: assignedInitial,
				geometry: geometryInitial,
			};
		case ACCEPT_CHANGES:
			console.time('one');
			const assigned = addSelectedDistrictsToAssignedList(
				districts.assigned,
				payload.selectedIds,
				payload.selectedDistrict
			);
			const geometry = getDistricts(assigned, payload.lockedDistricts, payload.topoJSON);
			console.timeEnd('one');
			return {
				assigned,
				geometry,
			};
		default:
			return districts;
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

const rectangleStartIdReducer = (countyfp = null, { type, payload }) => {
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
			const activatedIds = spatialSearch(
				payload.spatialIndex,
				payload.geoJSON,
				payload.lockedIds,
				payload.assignedDistricts,
				{
					rectangle: payload.rectangle,
					rectangleStartId: payload.rectangleStartId,
				}
			);
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
			const idIndex = selectedIds.indexOf(payload.id);
			if (!payload.lockedIds[payload.assignedDistricts[payload.id]]) {
				if (idIndex < 0) {
					return [...selectedIds, payload.id]; // Add to list
				}
				return [...selectedIds.slice(0, idIndex), ...selectedIds.slice(idIndex + 1)]; // Remove from list
			}
			return selectedIds;
		case RECTANGLE_SELECT:
			const newSelectedIds = spatialSearch(
				payload.spatialIndex,
				payload.geoJSON,
				payload.lockedIds,
				payload.assignedDistricts,
				{
					rectangle: payload.rectangle,
					rectangleStartId: payload.rectangleStartId,
				}
			);
			return [...new Set([...selectedIds, ...newSelectedIds])];
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

const createOptionReducer = (defaultOption, reducerName) => {
	return (mode = defaultOption, { type, payload }) => {
		switch (type) {
			case `CHANGE_OPTION_${reducerName}`:
				return payload;
			default:
				return mode;
		}
	};
};

const lockedIdsReducer = (lockedIds = lockedIdsTemplate, { type, payload }) => {
	switch (type) {
		case LOCK_DISTRICT:
			return Object.assign([...lockedIds], { [payload]: !lockedIds[payload] });
		default:
			return lockedIds;
	}
};

export default combineReducers({
	selectedDistrict: selectedDistrictReducer,
	spatialIndex: generateSpatialIndexReducer,
	topoJSON: regionTopoJSONReducer,
	geoJSON: geoJSONReducer,
	districts: assignedDistrictsReducer,
	selectedIds: selectedIdsReducer,
	activatedIds: activatedIdsReducer,
	geometries: geometriesReducer,
	districtColors: districtColorsReducer,
	rectangleStartId: rectangleStartIdReducer,
	lockedIds: lockedIdsReducer,
	drawMode: createOptionReducer('Rectangle', 'DRAW_MODE'),
	mapChoropleth: createOptionReducer('Off'),
	mapNumber: createOptionReducer('Off'),
	selectionLevel: createOptionReducer('County'),
	drawLimitToCounty: createOptionReducer(true),
	sidebarRaceDisplay: createOptionReducer('Chart'),
	sidebarPoliticsDisplay: createOptionReducer('Off'),
});
