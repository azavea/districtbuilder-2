import { spatialSearch, generateSpatialIndex } from '../util/data';

let index = null;
let geoJSON = null;

onmessage = function(e) {
	switch (e.data.type) {
		case 'INIT':
			index = generateSpatialIndex(e.data.geoJSON);
			geoJSON = e.data.geoJSON;
			break;
		default:
			postMessage({
				type: e.data.type,
				results: spatialSearch(
					index,
					geoJSON,
					e.data.lockedIds,
					e.data.assignedDistricts,
					e.data.selectionLevel,
					e.data.drawLimit,
					{
						rectangle: e.data.rectangle,
						rectangleStartId: e.data.rectangleStartId,
					}
				),
			});
	}
};
