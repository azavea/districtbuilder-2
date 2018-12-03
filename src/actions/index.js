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

export const clickGeounit = e => async dispatch => {
	const id = e.features[0].properties.id;
	await dispatch({ type: SELECT_GEOUNIT, payload: id });
};

export const clickDrawMode = mode => {
	return dispatch => {
		dispatch({ type: CHANGE_DRAWMODE, payload: mode });
	};
};

export const generateHighlight = topoJSON => {
	return dispatch => {
		dispatch({ type: GENERATE_HIGHLIGHT, payload: topoJSON });
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
