import { topoUrl } from '../constants';

export const DISTRICT_SELECTED = 'DISTRICT_SELECTED';
export const FETCH_SPATIAL_INDEX = 'FETCH_SPATIAL_INDEX';
export const FETCH_TOPOJSON = 'FETCH_TOPOJSON';
export const GENERATE_GEOMETRIES = 'GENERATE_GEOMETRIES';
export const GENERATE_GEOJSON = 'GENERATE_GEOJSON';
export const GENERATE_ASSIGNED_DISTRICTS = 'GENERATE_ASSIGNED_DISTRICTS';
export const GENERATE_ID_INDEX = 'GENERATE_ID_INDEX';
export const GENERATE_SPATIAL_INDEX = 'GENERATE_SPATIAL_INDEX';
export const SELECT_GEOUNIT = 'SELECT_GEOUNIT';
export const GENERATE_HIGHLIGHT = 'GENERATE_HIGHLIGHT';
export const LOAD_COLORS = 'LOAD_COLORS';
export const ACCEPT_CHANGES = 'ACCEPT_CHANGES';
export const CHANGE_DRAWMODE = 'CHANGE_DRAWMODE';
export const RECTANGLE_SELECT = 'RECTANGLE_SELECT';
export const RECTANGLE_ACTIVATE = 'RECTANGLE_ACTIVATE';
export const RECTANGLE_START = 'RECTANGLE_START';
export const LOCK_DISTRICT = 'LOCK_DISTRICT';
export const UPDATED_DISTRICTS = 'UPDATED_DISTRICTS';

export const selectDistrict = district => {
	return {
		type: DISTRICT_SELECTED,
		payload: district,
	};
};

export const fetchTopoAndGenerateGeo = () => async (dispatch, getState) => {
	await dispatch(fetchTopoJSON());
	dispatch(generateGeoJSONAndSpatialIndex());
};

export const fetchTopoJSON = () => {
	return async dispatch => {
		const response = await fetch(topoUrl).then(res => res.json());
		dispatch({ type: FETCH_TOPOJSON, payload: response });
	};
};

export const generateGeoJSONAndSpatialIndex = () => async (dispatch, getState) => {
	const topoJSON = getState().topoJSON;
	await dispatch(generateGeoJSON(topoJSON));
	dispatch(generateGeometries(topoJSON));
	dispatch(generateAssignedDistricts(topoJSON));
	dispatch(generateSpatialIndex(getState().geoJSON));
};

export const generateGeoJSON = topoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_GEOJSON, payload: topoJSON });
	};
};

export const generateAssignedDistricts = topoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_ASSIGNED_DISTRICTS, payload: topoJSON });
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

export const pointerSelect = e => (dispatch, getState) => {
	const id = e.features[0].properties.id;
	const lockedIds = getState().lockedIds;
	const assignedDistricts = getState().assignedDistricts;
	dispatch({ type: SELECT_GEOUNIT, payload: { id, lockedIds, assignedDistricts } });
};

export const rectangleStart = e => dispatch => {
	console.log('rectangleStart');
	const countyfp = e.features[0].properties.countyfp;
	dispatch({ type: RECTANGLE_START, payload: countyfp });
};

export const rectangleSelect = ({ rectangle, rectangleStartId }) => {
	return (dispatch, getState) => {
		const geoJSON = getState().geoJSON;
		const spatialIndex = getState().spatialIndex;
		const lockedIds = getState().lockedIds;
		console.log(lockedIds);
		const assignedDistricts = getState().assignedDistricts;
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
			},
		});
	};
};

export const rectangleActivate = ({ rectangle, rectangleStartId }) => {
	return (dispatch, getState) => {
		const geoJSON = getState().geoJSON;
		const spatialIndex = getState().spatialIndex;
		const lockedIds = getState().lockedIds;
		const assignedDistricts = getState().assignedDistricts;
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
			},
		});
	};
};

export const changeDrawMode = mode => {
	return dispatch => {
		dispatch({ type: CHANGE_DRAWMODE, payload: mode });
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
		dispatch({
			type: ACCEPT_CHANGES,
			payload: { selectedDistrict, selectedIds },
		});
	};
};
