import { ActionCreators } from 'redux-undo';

export const ACTIVATE_RESULTS = 'ACTIVATE_RESULTS';
export const ACTIVATE_PAINT_RESULTS = 'ACTIVATE_PAINT_RESULTS';
export const HOVER_RESULTS = 'HOVER_RESULTS';
export const SELECT_RESULTS = 'SELECT_RESULTS';
export const SELECT_ACTIVATED = 'SELECT_ACTIVATED';
export const DISTRICT_SELECTED = 'DISTRICT_SELECTED';
export const FETCH_SPATIAL_INDEX = 'FETCH_SPATIAL_INDEX';
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
export const CLICK_DOWN = 'CLICK_DOWN';
export const SPACE_DOWN = 'SPACE_DOWN';
export const CHANGE_ACTIVE_COUNTY = 'CHANGE_ACTIVE_COUNTY';
export const CHANGE_RECTANGLE_IN_PROGRESS = 'CHANGE_RECTANGLE_IN_PROGRESS';
export const CHANGE_OPTION_DRAW_COUNTY_LIMIT = 'CHANGE_OPTION_DRAW_COUNTY_LIMIT';
export const CHANGE_OPTION_DRAW_UNASSIGNED = 'CHANGE_OPTION_DRAW_UNASSIGNED';

export const generateAssignedDistricts = assignedDistricts => {
	return (dispatch, getState) => {
		const { lockedIds } = getState().historyState.present;
		dispatch({
			type: GENERATE_ASSIGNED_DISTRICTS,
			payload: { lockedIds, assignedDistricts },
		});
	};
};

export const selectDistrict = district => ({ type: DISTRICT_SELECTED, payload: district });

export const generateGeoJSON = topoJSON => ({ type: GENERATE_GEOJSON, payload: topoJSON });

export const generateGeometries = topoJSON => ({ type: GENERATE_GEOMETRIES, payload: topoJSON });

export const generateSpatialIndex = geoJSON => ({ type: GENERATE_SPATIAL_INDEX, payload: geoJSON });

export const generateCountyIndex = geoJSON => ({ type: GENERATE_COUNTY_INDEX, payload: geoJSON });

export const pointerSelect = e => (dispatch, getState) => {
	const id = e.features[0].properties.id;
	const countyfp = e.features[0].properties.countyfp;
	const { historyState, selectionLevel } = getState();
	const assignedDistricts = historyState.present.districts;
	const countyIds =
		selectionLevel === 'county'
			? window.dataCountyIndex[countyfp].geounits.filter(id => {
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

export const rectangleStart = e => (dispatch, getState) => {
	const rectangleStartId = getState().rectangleStartId;
	const countyfp = e.features[0].properties.countyfp;
	dispatch({ type: RECTANGLE_START, payload: rectangleStartId ? null : countyfp });
};

export const activateResults = results => ({ type: ACTIVATE_RESULTS, payload: results });

export const activatePaintResults = results => ({ type: ACTIVATE_PAINT_RESULTS, payload: results });

export const selectActivated = () => {
	return (dispatch, getState) => {
		const { activatedIds } = getState();
		dispatch({
			type: SELECT_ACTIVATED,
			payload: activatedIds,
		});
	};
};

export const hoverResults = results => ({ type: HOVER_RESULTS, payload: results });

export const selectResults = results => ({ type: SELECT_RESULTS, payload: results });

export const lockDistrict = districtId => ({ type: LOCK_DISTRICT, payload: districtId });

export const undo = () => ActionCreators.undo();

export const redo = () => ActionCreators.redo();

export const generateHighlight = topoJSON => ({ type: GENERATE_HIGHLIGHT, payload: topoJSON });

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

export const updateGeometry = geometry => ({ type: UPDATE_GEOMETRY, payload: geometry });

export const rejectChanges = () => ({ type: REJECT_CHANGES });

const createOptionAction = type => {
	return selectedOption => {
		return { type: type, payload: selectedOption };
	};
};

export const changeOptionDrawMode = createOptionAction(CHANGE_OPTION_DRAW_MODE);
export const changeOptionMapNumber = createOptionAction(CHANGE_OPTION_MAP_NUMBER);
export const changeOptionSelectionLevel = createOptionAction(CHANGE_OPTION_SELECTION_LEVEL);
export const changeOptionDrawLimit = createOptionAction(CHANGE_OPTION_DRAW_LIMIT);
export const changeOptionSidebarRace = createOptionAction(CHANGE_OPTION_SIDEBAR_RACE);
export const changeOptionSidebarPolitics = createOptionAction(CHANGE_OPTION_SIDEBAR_POLITICS);
export const changeOptionMapCountyName = createOptionAction(CHANGE_OPTION_MAP_COUNTY_NAME);
export const changeOptionMapLabels = createOptionAction(CHANGE_OPTION_MAP_LABELS);
export const changeOptionMapBasemap = createOptionAction(CHANGE_OPTION_MAP_BASEMAP);
export const changeOptionDrawCountyLimit = createOptionAction(CHANGE_OPTION_DRAW_COUNTY_LIMIT);
export const changeOptionDrawUnassigned = createOptionAction(CHANGE_OPTION_DRAW_UNASSIGNED);
export const clickDown = createOptionAction(CLICK_DOWN);
export const spaceDown = createOptionAction(SPACE_DOWN);
export const changeRectangleInProgress = createOptionAction(CHANGE_RECTANGLE_IN_PROGRESS);
export const changeActiveCounty = createOptionAction(CHANGE_ACTIVE_COUNTY);
