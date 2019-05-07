import { combineReducers } from 'redux';
import undoable from 'redux-undo';
import produce from 'immer';

import {
	ACTIVATE_RESULTS,
	ACTIVATE_PAINT_RESULTS,
	HOVER_RESULTS,
	SELECT_RESULTS,
	SELECT_ACTIVATED,
	DISTRICT_SELECTED,
	GENERATE_ASSIGNED_DISTRICTS,
	SELECT_GEOUNIT,
	ACCEPT_CHANGES,
	REJECT_CHANGES,
	RECTANGLE_START,
	LOCK_DISTRICT,
	CHANGE_OPTION_DRAW_MODE,
	CHANGE_OPTION_MAP_NUMBER,
	CHANGE_OPTION_SELECTION_LEVEL,
	CHANGE_OPTION_DRAW_LIMIT,
	CHANGE_OPTION_SIDEBAR_RACE,
	CHANGE_OPTION_SIDEBAR_POLITICS,
	UPDATE_GEOMETRY,
	CHANGE_OPTION_MAP_COUNTY_NAME,
	CHANGE_OPTION_MAP_LABELS,
	CHANGE_OPTION_MAP_BASEMAP,
	CLICK_DOWN,
	SPACE_DOWN,
	CHANGE_ACTIVE_COUNTY,
	CHANGE_RECTANGLE_IN_PROGRESS,
	CHANGE_OPTION_DRAW_COUNTY_LIMIT,
	CHANGE_OPTION_DRAW_UNASSIGNED,
} from '../actions';

import { districtColors, lockedIdsTemplate } from '../constants';

import {
	optionsDrawMode,
	optionsSelectionLevel,
	optionsMapNumber,
	optionsDrawLimit,
	optionsMapCountyName,
	optionsMapLabels,
	optionsMapBasemap,
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

const assignedDistrictsReducer = (districts = null, { type, payload }) => {
	switch (type) {
		case GENERATE_ASSIGNED_DISTRICTS:
			return districts ? districts : payload.assignedDistricts;
		case ACCEPT_CHANGES:
			return produce(districts, draft => {
				payload.selectedIds.forEach(id => {
					draft[id] = payload.selectedDistrict;
				});
			});
		default:
			return districts;
	}
};

const rectangleStartIdReducer = (countyfp = null, { type, payload }) => {
	switch (type) {
		case RECTANGLE_START:
			return payload;
		case CHANGE_OPTION_DRAW_MODE:
			return null;
		default:
			return countyfp;
	}
};

const activatedIdsReducer = (activatedIds = [], { type, payload }) => {
	switch (type) {
		case ACTIVATE_RESULTS:
			return payload;
		case ACTIVATE_PAINT_RESULTS:
			return [...new Set([...activatedIds, ...payload])];
		case SELECT_RESULTS:
		case ACCEPT_CHANGES:
		case REJECT_CHANGES:
		case SELECT_ACTIVATED:
			return [];
		default:
			return activatedIds;
	}
};

const hoveredIdsReducer = (hoveredIds = [], { type, payload }) => {
	switch (type) {
		case HOVER_RESULTS:
			return payload;
		case ACTIVATE_RESULTS:
		case SELECT_RESULTS:
		case ACCEPT_CHANGES:
		case REJECT_CHANGES:
			return [];
		default:
			return hoveredIds;
	}
};

const hasActiveReducer = (selectedIds = false, { type, payload }) => {
	switch (type) {
		case ACTIVATE_RESULTS:
			return payload.length > 0;
		case SELECT_RESULTS:
		case ACCEPT_CHANGES:
		case REJECT_CHANGES:
			return false;
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
			return [...new Set([...selectedIds, ...payload])];
		case SELECT_ACTIVATED:
			return [...new Set([...selectedIds, ...payload])];
		case ACCEPT_CHANGES:
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

const activeCountyReducer = (activeCounty = null, { type, payload }) => {
	switch (type) {
		case CHANGE_ACTIVE_COUNTY:
			return payload;
		default:
			return activeCounty;
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
	limit: 25,
	ignoreInitialState: true,
	filter: action =>
		[
			'SELECT_RESULTS',
			'SELECT_GEOUNIT',
			'LOCK_DISTRICT',
			'ACCEPT_CHANGES',
			'ACTIVATE_PAINT_RESULTS',
			'SELECT_ACTIVATED',
			'REJECT_CHANGES',
			'DISTRICT_SELECTED',
			'GENERATE_ASSIGNED_DISTRICTS',
		].includes(action.type),
};

export default combineReducers({
	historyState: undoable(
		combineReducers({
			selectedDistrict: selectedDistrictReducer,
			districts: assignedDistrictsReducer,
			lockedIds: lockedIdsReducer,
			selectedIds: selectedIdsReducer,
		}),
		undoableOptions
	),
	activatedIds: activatedIdsReducer,
	hoveredIds: hoveredIdsReducer,
	geometry: geometryReducer,
	districtColors: districtColorsReducer,
	rectangleStartId: rectangleStartIdReducer,
	activeCounty: activeCountyReducer,
	hasActive: hasActiveReducer,
	optionDrawCountyLimit: createOptionReducer(false, CHANGE_OPTION_DRAW_COUNTY_LIMIT),
	optionDrawUnassigned: createOptionReducer(false, CHANGE_OPTION_DRAW_UNASSIGNED),
	drawMode: createOptionReducer(optionsDrawMode[0].value, CHANGE_OPTION_DRAW_MODE),
	selectionLevel: createOptionReducer(
		optionsSelectionLevel[0].value,
		CHANGE_OPTION_SELECTION_LEVEL
	),
	mapNumber: createOptionReducer(optionsMapNumber[0].value, CHANGE_OPTION_MAP_NUMBER),
	sidebarRaceDisplay: createOptionReducer('chart', CHANGE_OPTION_SIDEBAR_RACE),
	sidebarPoliticsDisplay: createOptionReducer('off', CHANGE_OPTION_SIDEBAR_POLITICS),
	drawLimit: createToggleReducer(optionsDrawLimit[0].value, CHANGE_OPTION_DRAW_LIMIT),
	mapCountyName: createToggleReducer(optionsMapCountyName[0].value, CHANGE_OPTION_MAP_COUNTY_NAME),
	mapLabels: createOptionReducer(optionsMapLabels[3].value, CHANGE_OPTION_MAP_LABELS),
	mapBasemap: createOptionReducer(optionsMapBasemap[0].value, CHANGE_OPTION_MAP_BASEMAP),
	clickDown: createOptionReducer(false, CLICK_DOWN),
	spaceDown: createOptionReducer(false, SPACE_DOWN),
	rectangleInProgress: createOptionReducer(false, CHANGE_RECTANGLE_IN_PROGRESS),
});
