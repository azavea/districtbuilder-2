import { merge } from 'topojson';

import {
	topoObjectName,
	tileLocation,
	tileLayerName,
	districtColorsDefault,
	bucketNum,
} from '../constants';

export const updateHighlight = (selectedIds, topoJSON, map) => {
	console.log('updateHighlight');
	const allGeometries = topoJSON.objects[topoObjectName].geometries;
	const selectedGeometries = selectedIds.map(id => allGeometries[id]);
	const highlightGeoJSON = merge(topoJSON, selectedGeometries);

	if (typeof map.getSource('highlight-line') !== 'undefined') {
		map.getSource('highlight-line').setData(highlightGeoJSON);
		map.getSource('highlight-fill').setData(highlightGeoJSON);
	}
};

export const updateDistricts = (assignedDistricts, topoJSON, map) => {
	console.log('updateDistricts');
	const allGeometries = topoJSON.objects[topoObjectName].geometries;
	let geometriesByDistrict = [...Array(bucketNum).keys()].map(key => []);
	assignedDistricts.forEach((assignedDistrict, index) => {
		geometriesByDistrict[assignedDistrict].push(allGeometries[index]);
	});
	const districtsGeoJSON = geometriesByDistrict.map(geometries => {
		return merge(topoJSON, geometries);
	});

	districtsGeoJSON.forEach((geoJSON, index) => {
		const layerName = `district-${index}`;
		if (typeof map.getSource(layerName) !== 'undefined') {
			map.getSource(layerName).setData(geoJSON);
		}
	});
};

export const drawMapLayers = map => {
	// map.addLayer({
	// 	id: 'raster-basemap',
	// 	type: 'raster',
	// 	source: {
	// 		type: 'raster',
	// 		tiles: [
	// 			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
	// 		],
	// 		tileSize: 256,
	// 		minzoom: 1,
	// 		maxzoom: 13,
	// 	},
	// 	paint: {},
	// });

	[...Array(bucketNum).keys()].forEach(key => {
		map.addLayer({
			id: `district-${key}`,
			type: 'fill',
			source: {
				type: 'geojson',
				data: {
					type: 'Feature',
					geometry: { type: 'Polygon', coordinates: [[]] },
				},
			},
			paint: {
				'fill-color': districtColorsDefault[key],
				'fill-opacity': 0.4,
			},
		});
	});

	map.addSource('blockgroups', {
		type: 'vector',
		tiles: tileLocation,
		minzoom: 1,
		maxzoom: 12,
	});

	map.addLayer({
		id: 'counties-outline',
		type: 'line',
		source: 'blockgroups',
		'source-layer': 'uscounties',
		paint: {
			'line-color': '#000',
			'line-opacity': 1,
			'line-width': 1.5,
		},
	});

	map.addLayer({
		id: 'blockgroups-outline',
		type: 'line',
		source: 'blockgroups',
		'source-layer': tileLayerName,
		paint: {
			'line-color': '#000',
			'line-opacity': 0.1,
			'line-width': 1,
		},
	});

	map.addLayer({
		id: 'blockgroups-fill',
		type: 'fill',
		source: 'blockgroups',
		'source-layer': tileLayerName,
		paint: {
			'fill-color': 'transparent',
		},
	});

	map.addLayer({
		id: 'highlight-fill',
		type: 'fill',
		source: {
			type: 'geojson',
			data: {
				type: 'Feature',
				geometry: { type: 'Polygon', coordinates: [[]] },
			},
		},
		paint: {
			'fill-color': '#000',
			'fill-opacity': 0.5,
		},
	});

	map.addLayer({
		id: 'highlight-line',
		type: 'line',
		source: {
			type: 'geojson',
			data: {
				type: 'Feature',
				geometry: { type: 'Polygon', coordinates: [[]] },
			},
		},
		paint: {
			'line-color': '#000',
			'line-opacity': 1,
			'line-width': 5,
		},
	});
};
