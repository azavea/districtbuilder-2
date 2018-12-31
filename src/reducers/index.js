import { combineReducers } from 'redux';
import undoable from 'redux-undo';

import {
	ACTIVATE_RESULTS,
	SELECT_RESULTS,
	DISTRICT_SELECTED,
	GENERATE_ASSIGNED_DISTRICTS,
	SELECT_GEOUNIT,
	ACCEPT_CHANGES,
	REJECT_CHANGES,
	RECTANGLE_START,
	LOCK_DISTRICT,
	CHANGE_OPTION_DRAW_MODE,
	CHANGE_OPTION_MAP_CHOROPLETH,
	CHANGE_OPTION_MAP_NUMBER,
	CHANGE_OPTION_SELECTION_LEVEL,
	CHANGE_OPTION_DRAW_LIMIT,
	CHANGE_OPTION_SIDEBAR_RACE,
	CHANGE_OPTION_SIDEBAR_POLITICS,
	UPDATE_GEOMETRY,
} from '../actions';

import { districtColors, lockedIdsTemplate } from '../constants';

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

const geometryReducer = (geometry = null, { type, payload }) => {
	switch (type) {
		case UPDATE_GEOMETRY:
			return payload;
		default:
			return geometry;
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
	return assignedDistricts;
};

const assignedDistrictsReducer = (districts = null, { type, payload }) => {
	switch (type) {
		case GENERATE_ASSIGNED_DISTRICTS:
			const assignedInitial = payload.assignedDistricts;
			return assignedInitial;
		case ACCEPT_CHANGES:
			const assigned = addSelectedDistrictsToAssignedList(
				JSON.parse(JSON.stringify(districts)),
				payload.selectedIds,
				payload.selectedDistrict
			);
			return JSON.parse(JSON.stringify(assigned));
		default:
			return districts;
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
		case ACTIVATE_RESULTS:
			const activatedIds = payload.results;
			return activatedIds;
		case SELECT_RESULTS:
			return [];
		case ACCEPT_CHANGES:
			return [];
		case REJECT_CHANGES:
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
		case SELECT_RESULTS:
			const newSelectedIds = payload.results;
			return [...new Set([...selectedIds, ...newSelectedIds])];
		case ACCEPT_CHANGES:
			return [];
		case REJECT_CHANGES:
			return [];
		default:
			return selectedIds;
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

const undoableOptions = {
	limit: 10,
	filter: action =>
		[
			'LOCK_DISTRICT',
			'DISTRICT_SELECTED',
			'ACCEPT_CHANGES',
			'SELECT_RESULTS',
			'SELECT_GEOUNIT',
		].includes(action.type),
};

export default combineReducers({
	selectedDistrict: undoable(selectedDistrictReducer, undoableOptions),
	districts: undoable(assignedDistrictsReducer, undoableOptions),
	selectedIds: undoable(selectedIdsReducer, undoableOptions),
	lockedIds: undoable(lockedIdsReducer, undoableOptions),
	activatedIds: activatedIdsReducer,
	geometry: geometryReducer,
	districtColors: districtColorsReducer,
	rectangleStartId: rectangleStartIdReducer,
	drawMode: createOptionReducer(optionsDrawMode[0].id, CHANGE_OPTION_DRAW_MODE),
	selectionLevel: createOptionReducer(optionsSelectionLevel[0].id, CHANGE_OPTION_SELECTION_LEVEL),
	mapChoropleth: createOptionReducer(optionsMapChoropleth[0].id, CHANGE_OPTION_MAP_CHOROPLETH),
	mapNumber: createOptionReducer(optionsMapNumber[0].id, CHANGE_OPTION_MAP_NUMBER),
	sidebarRaceDisplay: createOptionReducer('chart', CHANGE_OPTION_SIDEBAR_RACE),
	sidebarPoliticsDisplay: createOptionReducer('off', CHANGE_OPTION_SIDEBAR_POLITICS),
	drawLimit: createToggleReducer(optionsDrawLimit[0].id, CHANGE_OPTION_DRAW_LIMIT),
});
