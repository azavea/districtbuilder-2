import { combineReducers } from 'redux';
import { feature } from 'topojson';

import {
	DISTRICT_SELECTED,
	FETCH_TOPOJSON,
	FETCH_GEOJSON,
	GENERATE_GEOMETRIES,
	GENERATE_GEOJSON,
	GENERATE_SPATIAL_INDEX,
	GENERATE_COUNTY_INDEX,
	GENERATE_ASSIGNED_DISTRICTS,
	SELECT_GEOUNIT,
	ACCEPT_CHANGES,
	RECTANGLE_SELECT,
	RECTANGLE_ACTIVATE,
	RECTANGLE_START,
	LOCK_DISTRICT,
	CHANGE_OPTION_DRAW_MODE,
	CHANGE_OPTION_MAP_CHOROPLETH,
	CHANGE_OPTION_MAP_NUMBER,
	CHANGE_OPTION_SELECTION_LEVEL,
	CHANGE_OPTION_DRAW_LIMIT,
	CHANGE_OPTION_SIDEBAR_RACE,
	CHANGE_OPTION_SIDEBAR_POLITICS,
} from '../actions';

import { generateSpatialIndex, spatialSearch, getDistricts } from '../util';
import { topoObjectName, districtColors, lockedIdsTemplate } from '../constants';

import {
	optionsDrawMode,
	optionsSelectionLevel,
	optionsMapChoropleth,
	optionsMapNumber,
	optionsDrawLimit,
} from '../constants/options';

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

const addSelectedDistrictsToAssignedList = (assignedDistricts, selectedIds, selectedDistrict) => {
	selectedIds.forEach(id => {
		assignedDistricts[id] = selectedDistrict;
	});
	return JSON.parse(JSON.stringify(assignedDistricts));
};

const assignedDistrictsReducer = (districts = null, { type, payload }) => {
	switch (type) {
		case GENERATE_ASSIGNED_DISTRICTS:
			const topoJSON = JSON.parse(window.dataTopoJSON);
			const assignedInitial = topoJSON.objects[topoObjectName].geometries.map(geometry => {
				return 0;
			});
			const geometryInitial = getDistricts(
				assignedInitial,
				payload.lockedDistricts,
				topoJSON
			);
			return {
				assigned: assignedInitial,
				geometry: geometryInitial,
			};
		case ACCEPT_CHANGES:
			const assigned = addSelectedDistrictsToAssignedList(
				districts.assigned,
				payload.selectedIds,
				payload.selectedDistrict
			);
			const geometry = getDistricts(
				assigned,
				payload.lockedDistricts,
				JSON.parse(window.dataTopoJSON)
			);
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
				window.dataSpatialIndex,
				JSON.parse(window.dataGeoJSON),
				payload.lockedIds,
				payload.assignedDistricts,
				payload.selectionLevel,
				payload.drawLimit,
				{
					rectangle: payload.rectangle,
					rectangleStartId: payload.rectangleStartId,
				}
			);
			switch (payload.selectionLevel) {
				case 'geounit':
					return activatedIds;
				case 'county':
					return activatedIds
						.map(id => window.dataCountyIndex[id])
						.flat()
						.filter(id => !payload.lockedIds[payload.assignedDistricts[id]]);
				default:
					return selectedIds;
			}
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
			if (idIndex === -1) {
				return [...new Set([...selectedIds, ...payload.countyIds])];
			} else {
				return selectedIds.filter(x => !payload.countyIds.includes(x));
			}
		case RECTANGLE_SELECT:
			const newSelectedIds = spatialSearch(
				window.dataSpatialIndex,
				JSON.parse(window.dataGeoJSON),
				payload.lockedIds,
				payload.assignedDistricts,
				payload.selectionLevel,
				payload.drawLimit,
				{
					rectangle: payload.rectangle,
					rectangleStartId: payload.rectangleStartId,
				}
			);
			switch (payload.selectionLevel) {
				case 'geounit':
					return [...new Set([...selectedIds, ...newSelectedIds])];
				case 'county':
					const foo = [
						...new Set([
							...selectedIds,
							...newSelectedIds.map(id => window.dataCountyIndex[id]).flat(),
						]),
					].filter(id => !payload.lockedIds[payload.assignedDistricts[id]]);
					return foo;
				default:
					return selectedIds;
			}
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

const generateCountyIndexReducer = (geoJSON = null, { type, payload }) => {
	switch (type) {
		case GENERATE_COUNTY_INDEX:
			let countyIndex = {};
			payload.features.forEach(feature => {
				if (countyIndex[feature.properties.countyfp] === undefined) {
					countyIndex[feature.properties.countyfp] = [];
				}
				countyIndex[feature.properties.countyfp].push(feature.properties.id);
			});
			return countyIndex;
		default:
			return geoJSON;
	}
};

const lockedIdsReducer = (lockedIds = lockedIdsTemplate, { type, payload }) => {
	switch (type) {
		case LOCK_DISTRICT:
			return Object.assign([...lockedIds], { [payload]: !lockedIds[payload] });
		default:
			return lockedIds;
	}
};

const createOptionReducer = (defaultOption, reducerName) => {
	return (mode = defaultOption, { type, payload }) => {
		switch (type) {
			case reducerName:
				return payload;
			default:
				return mode;
		}
	};
};

const createToggleReducer = (defaultOption, reducerName) => {
	return (mode = false, { type, payload }) => {
		switch (type) {
			case reducerName:
				return payload;
			default:
				return mode;
		}
	};
};

export default combineReducers({
	selectedDistrict: selectedDistrictReducer,
	districts: assignedDistrictsReducer,
	selectedIds: selectedIdsReducer,
	activatedIds: activatedIdsReducer,
	districtColors: districtColorsReducer,
	rectangleStartId: rectangleStartIdReducer,
	lockedIds: lockedIdsReducer,
	drawMode: createOptionReducer(optionsDrawMode[0].id, CHANGE_OPTION_DRAW_MODE),
	selectionLevel: createOptionReducer(optionsSelectionLevel[0].id, CHANGE_OPTION_SELECTION_LEVEL),
	mapChoropleth: createOptionReducer(optionsMapChoropleth[0].id, CHANGE_OPTION_MAP_CHOROPLETH),
	mapNumber: createOptionReducer(optionsMapNumber[0].id, CHANGE_OPTION_MAP_NUMBER),
	sidebarRaceDisplay: createOptionReducer('chart', CHANGE_OPTION_SIDEBAR_RACE),
	sidebarPoliticsDisplay: createOptionReducer('off', CHANGE_OPTION_SIDEBAR_POLITICS),
	drawLimit: createToggleReducer(optionsDrawLimit[0].id, CHANGE_OPTION_DRAW_LIMIT),
});
