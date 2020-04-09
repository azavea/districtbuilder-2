import { populationTypes } from '../constants';

export const calculatePopulationsOld = (assignedDistricts, features, oldDistricts) => {
	const newDistricts = JSON.parse(JSON.stringify(oldDistricts));
	assignedDistricts.forEach((assignedDistrict, index) => {
		populationTypes.forEach(type => {
			newDistricts[assignedDistrict][type] += features[index][type];
		});
	});
	return newDistricts;
};

export const calculatePopulationsNew = (
	selectedIds,
	activatedIds,
	selectedDistrict,
	assignedDistricts,
	features,
	oldDistricts
) => {
	const newDistricts = JSON.parse(JSON.stringify(oldDistricts));
	const allHighlightedIds = [...new Set([...selectedIds, ...activatedIds])];
	allHighlightedIds.forEach(id => {
		const geounit = features[id];
		populationTypes.forEach(type => {
			newDistricts[selectedDistrict][type] += geounit[type];
			newDistricts[assignedDistricts[geounit.blockgroup_id]][type] -= geounit[type];
		});
	});
	return newDistricts;
};
