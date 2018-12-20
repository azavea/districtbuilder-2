import { updateHighlight } from '../util/map';

onmessage = function(e) {
	postMessage(updateHighlight(e.data.selectedIds, e.data.activatedIds, e.data.topoJSON));
};
