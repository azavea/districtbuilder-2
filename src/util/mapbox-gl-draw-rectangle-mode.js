const doubleClickZoom = {
	enable: ctx => {
		setTimeout(() => {
			// First check we've got a map and some context.
			if (
				!ctx.map ||
				!ctx.map.doubleClickZoom ||
				!ctx._ctx ||
				!ctx._ctx.store ||
				!ctx._ctx.store.getInitialConfigValue
			)
				return;
			// Now check initial state wasn't false (we leave it disabled if so)
			if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) return;
			ctx.map.doubleClickZoom.enable();
		}, 0);
	},
	disable(ctx) {
		setTimeout(() => {
			if (!ctx.map || !ctx.map.doubleClickZoom) return;
			// Always disable here, as it's necessary in some cases.
			ctx.map.doubleClickZoom.disable();
		}, 0);
	},
};

const DrawRectangle = {
	// When the mode starts this function will be called.
	onSetup: function(opts) {
		const rectangle = this.newFeature({
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'Polygon',
				coordinates: [[]],
			},
		});
		this.addFeature(rectangle);
		this.clearSelectedFeatures();
		doubleClickZoom.disable(this);
		this.updateUIClasses({ mouse: 'add' });
		this.setActionableState({
			trash: true,
		});
		return {
			rectangle,
		};
	},
	// Whenever a user clicks on the map, Draw will call `onClick`
	onClick: function(state, e) {
		// if state.startPoint exist, means its second click
		//change to  simple_select mode
		if (
			state.startPoint &&
			state.startPoint[0] !== e.lngLat.lng &&
			state.startPoint[1] !== e.lngLat.lat
		) {
			this.updateUIClasses({ mouse: 'pointer' });
			state.endPoint = [e.lngLat.lng, e.lngLat.lat];
			this.changeMode('simple_select', { featuresId: state.rectangle.id });
		}
		// on first click, save clicked point coords as starting for  rectangle
		const startPoint = [e.lngLat.lng, e.lngLat.lat];
		state.startPoint = startPoint;
	},
	onMouseMove: function(state, e) {
		// if startPoint, update the feature coordinates, using the bounding box concept
		// we are simply using the startingPoint coordinates and the current Mouse Position
		// coordinates to calculate the bounding box on the fly, which will be our rectangle
		if (state.startPoint) {
			state.rectangle.updateCoordinate('0.0', state.startPoint[0], state.startPoint[1]); //minX, minY - the starting point
			state.rectangle.updateCoordinate('0.1', e.lngLat.lng, state.startPoint[1]); // maxX, minY
			state.rectangle.updateCoordinate('0.2', e.lngLat.lng, e.lngLat.lat); // maxX, maxY
			state.rectangle.updateCoordinate('0.3', state.startPoint[0], e.lngLat.lat); // minX,maxY
			state.rectangle.updateCoordinate('0.4', state.startPoint[0], state.startPoint[1]); //minX,minY - ending point (equals to starting point)
			this.map.fire('draw.move', {
				features: [state.rectangle.toGeoJSON()],
			});
		}
	},
	// Whenever a user clicks on a key while focused on the map, it will be sent here
	onKeyUp: function(state, e) {
		if (e.keyCode === 27) return this.changeMode('simple_select');
	},
	onStop: function(state) {
		doubleClickZoom.enable(this);
		this.updateUIClasses({ mouse: 'none' });
		this.activateUIButton();

		// check to see if we've deleted this feature
		if (this.getFeature(state.rectangle.id) === undefined) return;

		//remove last added coordinate
		state.rectangle.removeCoordinate('0.4');
		if (state.rectangle.isValid()) {
			this.map.fire('draw.create', {
				features: [state.rectangle.toGeoJSON()],
			});
		} else {
			this.deleteFeature([state.rectangle.id], { silent: true });
			this.changeMode('simple_select', {}, { silent: true });
		}
	},
	toDisplayFeatures: function(state, geojson, display) {
		const isActivePolygon = geojson.properties.id === state.rectangle.id;
		geojson.properties.active = isActivePolygon ? 'true' : 'false';
		if (!isActivePolygon) return display(geojson);

		// Only render the rectangular polygon if it has the starting point
		if (!state.startPoint) return;
		return display(geojson);
	},
	onTrash: function(state) {
		this.deleteFeature([state.rectangle.id], { silent: true });
		this.changeMode('simple_select');
	},
};

export default DrawRectangle;

// custom mapbopx-gl-draw mode that modifies draw_line_string
// shows a center point, radius line, and circle polygon while drawing
// forces draw.create on creation of second vertex

// import MapboxDraw from 'mapbox-gl-draw';
// import numeral from 'numeral';
// import lineDistance from 'turf';

// const RadiusMode = {};

// function createVertex(parentId, coordinates, path, selected) {
// 	return {
// 		type: 'Feature',
// 		properties: {
// 			meta: 'vertex',
// 			parent: parentId,
// 			coord_path: path,
// 			active: selected ? 'true' : 'false',
// 		},
// 		geometry: {
// 			type: 'Point',
// 			coordinates,
// 		},
// 	};
// }

// // create a circle-like polygon given a center point and radius
// // https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js/39006388#39006388
// function createGeoJSONCircle(center, radiusInKm, parentId, points = 64) {
// 	const coords = {
// 		latitude: center[1],
// 		longitude: center[0],
// 	};

// 	const km = radiusInKm;

// 	const ret = [];
// 	const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
// 	const distanceY = km / 110.574;

// 	let theta;
// 	let x;
// 	let y;
// 	for (let i = 0; i < points; i += 1) {
// 		theta = (i / points) * (2 * Math.PI);
// 		x = distanceX * Math.cos(theta);
// 		y = distanceY * Math.sin(theta);

// 		ret.push([coords.longitude + x, coords.latitude + y]);
// 	}
// 	ret.push(ret[0]);

// 	return {
// 		type: 'Feature',
// 		geometry: {
// 			type: 'Polygon',
// 			coordinates: [ret],
// 		},
// 		properties: {
// 			parent: parentId,
// 		},
// 	};
// }

// function getDisplayMeasurements(feature) {
// 	// should log both metric and standard display strings for the current drawn feature

// 	// metric calculation
// 	const drawnLength = lineDistance(feature) * 1000; // meters

// 	let metricUnits = 'm';
// 	let metricFormat = '0,0';
// 	let metricMeasurement;

// 	let standardUnits = 'feet';
// 	let standardFormat = '0,0';
// 	let standardMeasurement;

// 	metricMeasurement = drawnLength;
// 	if (drawnLength >= 1000) {
// 		// if over 1000 meters, upgrade metric
// 		metricMeasurement = drawnLength / 1000;
// 		metricUnits = 'km';
// 		metricFormat = '0.00';
// 	}

// 	standardMeasurement = drawnLength * 3.28084;
// 	if (standardMeasurement >= 5280) {
// 		// if over 5280 feet, upgrade standard
// 		standardMeasurement /= 5280;
// 		standardUnits = 'mi';
// 		standardFormat = '0.00';
// 	}

// 	const displayMeasurements = {
// 		metric: `${numeral(metricMeasurement).format(metricFormat)} ${metricUnits}`,
// 		standard: `${numeral(standardMeasurement).format(standardFormat)} ${standardUnits}`,
// 	};

// 	return displayMeasurements;
// }

// const doubleClickZoom = {
// 	enable: ctx => {
// 		setTimeout(() => {
// 			// First check we've got a map and some context.
// 			if (
// 				!ctx.map ||
// 				!ctx.map.doubleClickZoom ||
// 				!ctx._ctx ||
// 				!ctx._ctx.store ||
// 				!ctx._ctx.store.getInitialConfigValue
// 			)
// 				return;
// 			// Now check initial state wasn't false (we leave it disabled if so)
// 			if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) return;
// 			ctx.map.doubleClickZoom.enable();
// 		}, 0);
// 	},
// };

// RadiusMode.clickAnywhere = function(state, e) {
// 	// this ends the drawing after the user creates a second point, triggering this.onStop
// 	if (state.currentVertexPosition === 1) {
// 		state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
// 		return this.changeMode('simple_select', { featureIds: [state.line.id] });
// 	}
// 	this.updateUIClasses({ mouse: 'add' });
// 	state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// 	if (state.direction === 'forward') {
// 		state.currentVertexPosition += 1; // eslint-disable-line
// 		state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// 	} else {
// 		state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
// 	}

// 	return null;
// };

// // creates the final geojson point feature with a radius property
// // triggers draw.create
// RadiusMode.onStop = function(state) {
// 	doubleClickZoom.enable(this);

// 	this.activateUIButton();

// 	// check to see if we've deleted this feature
// 	if (this.getFeature(state.line.id) === undefined) return;

// 	// remove last added coordinate
// 	state.line.removeCoordinate('0');
// 	if (state.line.isValid()) {
// 		const lineGeoJson = state.line.toGeoJSON();
// 		// reconfigure the geojson line into a geojson point with a radius property
// 		const pointWithRadius = {
// 			type: 'Feature',
// 			geometry: {
// 				type: 'Point',
// 				coordinates: lineGeoJson.geometry.coordinates[0],
// 			},
// 			properties: {
// 				radius: (lineDistance(lineGeoJson) * 1000).toFixed(1),
// 			},
// 		};

// 		this.map.fire('draw.create', {
// 			features: [pointWithRadius],
// 		});
// 	} else {
// 		this.deleteFeature([state.line.id], { silent: true });
// 		this.changeMode('simple_select', {}, { silent: true });
// 	}
// };

// RadiusMode.toDisplayFeatures = function(state, geojson, display) {
// 	const isActiveLine = geojson.properties.id === state.line.id;
// 	geojson.properties.active = isActiveLine ? 'true' : 'false';
// 	if (!isActiveLine) return display(geojson);

// 	// Only render the line if it has at least one real coordinate
// 	if (geojson.geometry.coordinates.length < 2) return null;
// 	geojson.properties.meta = 'feature';

// 	// displays center vertex as a point feature
// 	display(
// 		createVertex(
// 			state.line.id,
// 			geojson.geometry.coordinates[
// 				state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1
// 			],
// 			`${state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1}`,
// 			false
// 		)
// 	);

// 	// displays the line as it is drawn
// 	display(geojson);

// 	const displayMeasurements = getDisplayMeasurements(geojson);

// 	// create custom feature for the current pointer position
// 	const currentVertex = {
// 		type: 'Feature',
// 		properties: {
// 			meta: 'currentPosition',
// 			radiusMetric: displayMeasurements.metric,
// 			radiusStandard: displayMeasurements.standard,
// 			parent: state.line.id,
// 		},
// 		geometry: {
// 			type: 'Point',
// 			coordinates: geojson.geometry.coordinates[1],
// 		},
// 	};
// 	display(currentVertex);

// 	// create custom feature for radius circlemarker
// 	const center = geojson.geometry.coordinates[0];
// 	const radiusInKm = lineDistance(geojson, 'kilometers');
// 	const circleFeature = createGeoJSONCircle(center, radiusInKm, state.line.id);
// 	circleFeature.properties.meta = 'radius';

// 	display(circleFeature);

// 	return null;
// };

// export default RadiusMode;
