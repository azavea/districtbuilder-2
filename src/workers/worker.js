import geobuf from 'geobuf';
import Pbf from 'pbf';

import { updateHighlight } from '../util/map';
import { spatialSearch, generateSpatialIndex } from '../util/data';
import { getDistricts } from '../util/map';

const topoRequest = fetch('data/pa-bg.topojson').then(res => res.json());
const geoRequest = fetch('data/pa-bg.geojson').then(res => res.json());
let topoJSON;
let geoJSON;
let index;
let type;
let results;
let districtCompactnessScores;
let mergedGeoJSON;

Promise.all([topoRequest, geoRequest]).then(responses => {
	topoJSON = responses[0];
	geoJSON = geobuf.encode(responses[1], new Pbf()).buffer;
	index = generateSpatialIndex(responses[1]);
});

onmessage = function(e) {
	switch (e.data.type) {
		case 'DISTRICTS':
			type = e.data.type;
			results = getDistricts(e.data.assignedDistricts, e.data.lockedDistricts, topoJSON);
			districtCompactnessScores = results.districtCompactnessScores;
			mergedGeoJSON = geobuf.encode(results.mergedGeoJSON, new Pbf()).buffer;
			postMessage({ type, districtCompactnessScores, mergedGeoJSON }, [mergedGeoJSON]);
			break;
		case 'HIGHLIGHT':
			type = e.data.type;
			results = geobuf.encode(
				updateHighlight(e.data.selectedIds, e.data.activatedIds, topoJSON),
				new Pbf()
			).buffer;
			postMessage(
				{
					type,
					results,
				},
				[results]
			);
			break;
		case 'ACTIVATE':
		case 'SELECT':
			type = e.data.type;
			results = spatialSearch(
				index,
				geobuf.decode(new Pbf(geoJSON)),
				e.data.lockedIds,
				e.data.assignedDistricts,
				e.data.selectionLevel,
				e.data.drawLimit,
				{
					rectangle: e.data.rectangle,
					rectangleStartId: e.data.rectangleStartId,
				}
			);
			postMessage({
				type,
				results,
			});
			break;
		default:
			break;
	}
};
