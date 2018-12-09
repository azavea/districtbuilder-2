import { populationTypes } from '../constants';

export const calculatePopulationsOld = (assignedDistricts, geometries, oldDistricts) => {
	const newDistricts = JSON.parse(JSON.stringify(oldDistricts));
	assignedDistricts.forEach((assignedDistrict, index) => {
		populationTypes.forEach(type => {
			newDistricts[assignedDistrict][type] += geometries[index][type];
		});
	});
	return newDistricts;
};

export const calculatePopulationsNew = (
	selectedIds,
	activatedIds,
	selectedDistrict,
	assignedDistricts,
	geometries,
	oldDistricts
) => {
	// TODO: consider splitting out calculatePopulationsNew into two functions, which would allow us
	// to separately memoize the selectedIds and the highlightedIds; not sure if this is a good idea
	const newDistricts = JSON.parse(JSON.stringify(oldDistricts));
	const allHighlightedIds = [...new Set([...selectedIds, ...activatedIds])];
	allHighlightedIds.forEach(id => {
		const geounit = geometries[id];
		populationTypes.forEach(type => {
			newDistricts[selectedDistrict][type] += geounit[type];
			newDistricts[assignedDistricts[geounit.id]][type] -= geounit[type];
		});
	});
	return newDistricts;
};
