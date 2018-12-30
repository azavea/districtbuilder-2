import geobuf from 'geobuf';
import Pbf from 'pbf';

import { updateHighlight } from '../util/map';
import { getDistricts } from '../util/map';

const topoRequest = fetch('data/pa-bg.topojson').then(res => res.json());
let topoJSON;
let type;
let results;
let districtCompactnessScores;
let mergedGeoJSON;

Promise.all([topoRequest]).then(responses => {
	topoJSON = responses[0];
});

onmessage = function(e) {
	switch (e.data.type) {
		case 'DISTRICTS':
			type = e.data.type;
			results = getDistricts(e.data.assignedDistricts, topoJSON);
			districtCompactnessScores = results.districtCompactnessScores;
			mergedGeoJSON = geobuf.encode(results.mergedGeoJSON, new Pbf()).buffer;
			postMessage({ type, districtCompactnessScores, mergedGeoJSON }, [mergedGeoJSON]);
			break;
		case 'DOWNLOAD_GEOJSON':
			type = e.data.type;
			results = getDistricts(e.data.assignedDistricts, topoJSON);
			mergedGeoJSON = geobuf.encode(results.mergedGeoJSON, new Pbf()).buffer;
			postMessage({ type, mergedGeoJSON }, [mergedGeoJSON]);
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
		default:
			break;
	}
};
