import { combineReducers } from 'redux';

import {
	ACTIVATE_RESULTS,
	SELECT_RESULTS,
	DISTRICT_SELECTED,
	GENERATE_ASSIGNED_DISTRICTS,
	SELECT_GEOUNIT,
	ACCEPT_CHANGES,
	REJECT_CHANGES,
	RECTANGLE_SELECT,
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

import { getDistricts } from '../util';
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
			const topoJSON = window.dataTopoJSON;
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
			const geometry = getDistricts(assigned, payload.lockedDistricts, window.dataTopoJSON);
			return {
				assigned,
				geometry,
			};
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
