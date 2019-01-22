import geobuf from 'geobuf';
import Pbf from 'pbf';

import { topoUrl } from '../constants';
import { updateHighlight, getDistricts } from '../util/map';

let topoJSON;
let type;
let results;
let districtCompactnessScores;
let mergedGeoJSON;

fetch(topoUrl)
	.then(res => res.json())
	.then(response => {
		topoJSON = response;
	});

const onDistrictDraw = (e, results) => {
	type = e.data.type;
	results = getDistricts(e.data.assignedDistricts, topoJSON);
	districtCompactnessScores = results.districtCompactnessScores;
	mergedGeoJSON = geobuf.encode(results.mergedGeoJSON, new Pbf()).buffer;
	postMessage({ type, districtCompactnessScores, mergedGeoJSON }, [mergedGeoJSON]);
};

onmessage = function(e) {
	if (topoJSON) {
		switch (e.data.type) {
			case 'DISTRICTS':
				onDistrictDraw(e, results);
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
	}
};
