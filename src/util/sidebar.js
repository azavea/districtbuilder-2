import { populationTypes } from '../constants';

export const calculatePopulationsOld = (assignedDistricts, geometries, oldDistricts) => {
	const newDistricts = JSON.parse(JSON.stringify(oldDistricts));
	console.log('Calculate Population Base');
	assignedDistricts.forEach((assignedDistrict, index) => {
		populationTypes.forEach(type => {
			newDistricts[assignedDistrict][type] += geometries[index][type];
		});
	});
	return newDistricts;
};

export const calculatePopulationsNew = (
	selectedIds,
	selectedDistrict,
	assignedDistricts,
	oldDistricts,
	geometries
) => {
	console.log('Calculate Population Change');
	const newDistricts = JSON.parse(JSON.stringify(oldDistricts));
	selectedIds.forEach(id => {
		const unit = geometries[id];
		populationTypes.forEach(type => {
			newDistricts[selectedDistrict][type] += unit[type];
			newDistricts[assignedDistricts[unit.id]][type] -= unit[type];
		});
	});
	return newDistricts;
};
