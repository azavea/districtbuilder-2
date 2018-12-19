import { topoUrl, geoUrl } from '../constants';

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

export const selectDistrict = district => {
	return {
		type: DISTRICT_SELECTED,
		payload: district,
	};
};

export const fetchTopoAndGenerateGeo = () => async (dispatch, getState) => {
	// dispatch(fetchTopoJSON());
	// await dispatch(fetchGeoJSON());
	// dispatch(generateGeoJSONAndSpatialIndex());
	dispatch(generateAssignedDistricts(window.dataTopoJSON));
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

export const generateGeoJSONAndSpatialIndex = () => async (dispatch, getState) => {
	// const topoJSON = getState().topoJSON;
	// await dispatch(generateGeoJSON(topoJSON));
	// await dispatch(fetchGeoJSON(topoJSON));
	// const geoJSON = getState().geoJSON;
	// dispatch(generateGeometries(topoJSON));
	// dispatch(generateAssignedDistricts(topoJSON));
	// dispatch(generateSpatialIndex(geoJSON));
	// dispatch(generateCountyIndex(geoJSON));
};

export const generateGeoJSON = topoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_GEOJSON, payload: topoJSON });
	};
};

export const generateAssignedDistricts = topoJSON => {
	return (dispatch, getState) => {
		const lockedDistricts = getState().lockedIds;
		dispatch({ type: GENERATE_ASSIGNED_DISTRICTS, payload: { topoJSON, lockedDistricts } });
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
	const id = JSON.parse(JSON.stringify(e.features[0].properties.id));
	const countyfp = e.features[0].properties.countyfp;
	const { lockedIds, districts, selectionLevel } = getState();
	const assignedDistricts = districts.assigned;
	const countyIds =
		selectionLevel === 'county'
			? window.dataCountyIndex[countyfp].filter(id => {
					return !lockedIds[assignedDistricts[id]];
			  })
			: [id];
	const unlocked = !lockedIds[assignedDistricts[id]];
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

export const rectangleSelect = ({ rectangle, rectangleStartId }) => {
	return (dispatch, getState) => {
		const geoJSON = window.dataGeoJSON;
		const spatialIndex = window.dataSpatialIndex;
		const countyIndex = window.dataCountyIndex;
		const lockedIds = getState().lockedIds;
		const assignedDistricts = getState().districts.assigned;
		const selectionLevel = getState().selectionLevel;
		const drawLimit = getState().drawLimit;
		dispatch({
			type: RECTANGLE_SELECT,
			payload: {
				queryType: 'rectangle',
				rectangle,
				rectangleStartId,
				lockedIds,
				spatialIndex,
				geoJSON,
				assignedDistricts,
				countyIndex,
				selectionLevel,
				drawLimit,
			},
		});
	};
};

export const rectangleActivate = ({ rectangle, rectangleStartId }) => {
	return (dispatch, getState) => {
		const geoJSON = window.dataGeoJSON;
		const spatialIndex = window.dataSpatialIndex;
		const countyIndex = window.dataCountyIndex;
		const lockedIds = getState().lockedIds;
		const assignedDistricts = getState().districts.assigned;
		const selectionLevel = getState().selectionLevel;
		const drawLimit = getState().drawLimit;
		dispatch({
			type: RECTANGLE_ACTIVATE,
			payload: {
				queryType: 'rectangle',
				rectangle,
				rectangleStartId,
				lockedIds,
				spatialIndex,
				geoJSON,
				assignedDistricts,
				countyIndex,
				selectionLevel,
				drawLimit,
			},
		});
	};
};

export const lockDistrict = districtId => {
	return dispatch => {
		dispatch({ type: LOCK_DISTRICT, payload: districtId });
	};
};

export const generateHighlight = topoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_HIGHLIGHT, payload: topoJSON });
	};
};

export const updatedDistricts = compactness => {
	return dispatch => {
		dispatch({ type: UPDATED_DISTRICTS, payload: compactness });
	};
};

export const acceptChanges = () => {
	return (dispatch, getState) => {
		const selectedDistrict = getState().selectedDistrict;
		const selectedIds = getState().selectedIds;
		const lockedDistricts = getState().lockedDistricts;
		const topoJSON = window.dataTopoJSON;
		dispatch({
			type: ACCEPT_CHANGES,
			payload: { selectedDistrict, selectedIds, lockedDistricts, topoJSON },
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
