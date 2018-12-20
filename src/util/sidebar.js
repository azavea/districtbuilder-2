import { populationTypes } from '../constants';

export const calculatePopulationsOld = (assignedDistricts, geoJSON, oldDistricts) => {
	const newDistricts = JSON.parse(JSON.stringify(oldDistricts));
	assignedDistricts.forEach((assignedDistrict, index) => {
		populationTypes.forEach(type => {
			newDistricts[assignedDistrict][type] += geoJSON.features[index].properties[type];
		});
	});
	return newDistricts;
};

export const calculatePopulationsNew = (
	selectedIds,
	activatedIds,
	selectedDistrict,
	assignedDistricts,
	geoJSON,
	oldDistricts
) => {
	const newDistricts = JSON.parse(JSON.stringify(oldDistricts));
	const allHighlightedIds = [...new Set([...selectedIds, ...activatedIds])];
	allHighlightedIds.forEach(id => {
		const geounit = geoJSON.features[id];
		populationTypes.forEach(type => {
			newDistricts[selectedDistrict][type] += geounit.properties[type];
			newDistricts[assignedDistricts[geounit.properties.id]][type] -=
				geounit.properties[type];
		});
	});
	return newDistricts;
};
