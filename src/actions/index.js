import { ActionCreators } from 'redux-undo';

import { topoUrl, geoUrl } from '../constants';

export const ACTIVATE_RESULTS = 'ACTIVATE_RESULTS';
export const SELECT_RESULTS = 'SELECT_RESULTS';
export const DISTRICT_SELECTED = 'DISTRICT_SELECTED';
export const FETCH_SPATIAL_INDEX = 'FETCH_SPATIAL_INDEX';
export const FETCH_TOPOJSON = 'FETCH_TOPOJSON';
export const FETCH_GEOJSON = 'FETCH_GEOJSON';
export const GENERATE_GEOMETRIES = 'GENERATE_GEOMETRIES';
export const GENERATE_GEOJSON = 'GENERATE_GEOJSON';
export const GENERATE_ASSIGNED_DISTRICTS = 'GENERATE_ASSIGNED_DISTRICTS';
export const GENERATE_COUNTY_INDEX = 'GENERATE_COUNTY_INDEX';
export const GENERATE_SPATIAL_INDEX = 'GENERATE_SPATIAL_INDEX';
export const SELECT_GEOUNIT = 'SELECT_GEOUNIT';
export const GENERATE_HIGHLIGHT = 'GENERATE_HIGHLIGHT';
export const LOAD_COLORS = 'LOAD_COLORS';
export const ACCEPT_CHANGES = 'ACCEPT_CHANGES';
export const REJECT_CHANGES = 'REJECT_CHANGES';
export const UPDATE_GEOMETRY = 'UPDATE_GEOMETRY';
export const RECTANGLE_SELECT = 'RECTANGLE_SELECT';
export const RECTANGLE_ACTIVATE = 'RECTANGLE_ACTIVATE';
export const RECTANGLE_START = 'RECTANGLE_START';
export const LOCK_DISTRICT = 'LOCK_DISTRICT';
export const UPDATED_DISTRICTS = 'UPDATED_DISTRICTS';
export const CHANGE_OPTION_DRAW_MODE = 'CHANGE_OPTION_DRAW_MODE';
export const CHANGE_OPTION_MAP_CHOROPLETH = 'CHANGE_OPTION_MAP_CHOROPLETH';
export const CHANGE_OPTION_MAP_NUMBER = 'CHANGE_OPTION_MAP_NUMBER';
export const CHANGE_OPTION_SELECTION_LEVEL = 'CHANGE_OPTION_SELECTION_LEVEL';
export const CHANGE_OPTION_DRAW_LIMIT = 'CHANGE_OPTION_DRAW_LIMIT';
export const CHANGE_OPTION_SIDEBAR_RACE = 'CHANGE_OPTION_SIDEBAR_RACE';
export const CHANGE_OPTION_SIDEBAR_POLITICS = 'CHANGE_OPTION_SIDEBAR_POLITICS';
export const CHANGE_OPTION_MAP_COUNTY_NAME = 'CHANGE_OPTION_MAP_COUNTY_NAME';
export const CHANGE_OPTION_MAP_LABELS = 'CHANGE_OPTION_MAP_LABELS';
export const CHANGE_OPTION_MAP_BASEMAP = 'CHANGE_OPTION_MAP_BASEMAP';
export const CHANGE_OPTION_MAP_POPULATIONS_LABELS = 'CHANGE_OPTION_MAP_POPULATIONS_LABELS';

export const selectDistrict = district => {
	return {
		type: DISTRICT_SELECTED,
		payload: district,
	};
};

export const fetchTopoJSON = () => {
	return async dispatch => {
		const response = await fetch(topoUrl).then(res => res.json());
		dispatch({ type: FETCH_TOPOJSON, payload: response });
	};
};

export const fetchGeoJSON = () => {
	return async dispatch => {
		const response = await fetch(geoUrl).then(res => res.json());
		dispatch({ type: FETCH_GEOJSON, payload: response });
	};
};

export const generateGeoJSON = topoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_GEOJSON, payload: topoJSON });
	};
};

export const generateAssignedDistricts = assignedDistricts => {
	return (dispatch, getState) => {
		const { lockedIds } = getState().historyState.present;
		dispatch({
			type: GENERATE_ASSIGNED_DISTRICTS,
			payload: { lockedIds, assignedDistricts },
		});
	};
};

export const generateGeometries = topoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_GEOMETRIES, payload: topoJSON });
	};
};

export const generateSpatialIndex = geoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_SPATIAL_INDEX, payload: geoJSON });
	};
};

export const generateCountyIndex = geoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_COUNTY_INDEX, payload: geoJSON });
	};
};

export const pointerSelect = e => (dispatch, getState) => {
	const id = e.features[0].properties.id;
	const countyfp = e.features[0].properties.countyfp;
	const { historyState, selectionLevel } = getState();
	const assignedDistricts = historyState.present.districts;
	const countyIds =
		selectionLevel === 'county'
			? window.dataCountyIndex[countyfp].filter(id => {
					return !historyState.present.lockedIds[assignedDistricts[id]];
			  })
			: [id];
	const unlocked = !historyState.present.lockedIds[assignedDistricts[id]];
	if (unlocked) {
		dispatch({
			type: SELECT_GEOUNIT,
			payload: { id, countyIds },
		});
	}
};

export const rectangleStart = e => dispatch => {
	const countyfp = e.features[0].properties.countyfp;
	dispatch({ type: RECTANGLE_START, payload: countyfp });
};

export const activateResults = results => {
	return (dispatch, getState) => {
		dispatch({
			type: ACTIVATE_RESULTS,
			payload: { results },
		});
	};
};

export const selectResults = results => {
	return (dispatch, getState) => {
		dispatch({
			type: SELECT_RESULTS,
			payload: { results },
		});
	};
};

export const lockDistrict = districtId => {
	return dispatch => {
		dispatch({ type: LOCK_DISTRICT, payload: districtId });
	};
};

export const undo = () => {
	return dispatch => {
		dispatch(ActionCreators.undo());
	};
};

export const redo = () => {
	return dispatch => {
		dispatch(ActionCreators.redo());
	};
};

export const generateHighlight = topoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_HIGHLIGHT, payload: topoJSON });
	};
};

export const acceptChanges = () => {
	return (dispatch, getState) => {
		const { selectedDistrict, selectedIds, lockedDistricts } = getState().historyState.present;
		dispatch({
			type: ACCEPT_CHANGES,
			payload: {
				selectedDistrict: selectedDistrict,
				selectedIds: selectedIds,
				lockedDistricts,
			},
		});
	};
};

export const updateGeometry = geometry => {
	return (dispatch, getState) => {
		dispatch({
			type: UPDATE_GEOMETRY,
			payload: geometry,
		});
	};
};

export const rejectChanges = () => {
	return dispatch => {
		dispatch({
			type: REJECT_CHANGES,
			payload: null,
		});
	};
};

const createOptionAction = type => {
	return selectedOption => {
		return dispatch => {
			dispatch({ type: type, payload: selectedOption });
		};
	};
};

export const changeOptionDrawMode = createOptionAction(CHANGE_OPTION_DRAW_MODE);
export const changeOptionMapChoropleth = createOptionAction(CHANGE_OPTION_MAP_CHOROPLETH);
export const changeOptionMapNumber = createOptionAction(CHANGE_OPTION_MAP_NUMBER);
export const changeOptionSelectionLevel = createOptionAction(CHANGE_OPTION_SELECTION_LEVEL);
export const changeOptionDrawLimit = createOptionAction(CHANGE_OPTION_DRAW_LIMIT);
export const changeOptionSidebarRace = createOptionAction(CHANGE_OPTION_SIDEBAR_RACE);
export const changeOptionSidebarPolitics = createOptionAction(CHANGE_OPTION_SIDEBAR_POLITICS);
export const changeOptionMapCountyName = createOptionAction(CHANGE_OPTION_MAP_COUNTY_NAME);
export const changeOptionMapLabels = createOptionAction(CHANGE_OPTION_MAP_LABELS);

export const changeOptionMapBasemap = createOptionAction(CHANGE_OPTION_MAP_BASEMAP);
export const changeOptionMapPopulationsLabels = createOptionAction(
	CHANGE_OPTION_MAP_POPULATIONS_LABELS
);
