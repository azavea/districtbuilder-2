import React from 'react';

import { populationTypes } from '../constants';

const renderList = (districtNew, districtOld) => {
	const totalPopulation = districtNew.population + districtOld.population;
	return populationTypes.slice(1).map((type, index) => {
		const typePopulation = districtNew[type] + districtOld[type];
		const percent = (typePopulation / totalPopulation) * 100 + '%';
		const myStyle = { width: percent };
		return <div className={`demographic demographic-${index}`} style={myStyle} key={index} />;
	});
};

export function DemographicChart(props) {
	return <div className="demographics">{renderList(props.districtNew, props.districtOld)}</div>;
}
