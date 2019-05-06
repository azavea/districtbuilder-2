export const assignedFilter = (districts, selectedDistrict, id) => {
	return districts[id] === 0 || selectedDistrict === 0;
};

export const lockedFilter = (lockedIds, districts, id) => {
	return !lockedIds[districts[id]];
};

export const countyFilter = (activeCounty, id) => {
	return window.dataFeatures[id].countyfp === activeCounty;
};
