import React from 'react';

import { demographicTypes } from '../constants';

const renderList = (districtNew, districtOld) => {
	const totalPopulation = districtNew.population + districtOld.population;
	return demographicTypes.map((type, index) => {
		const typePopulation = districtNew[type] + districtOld[type];
		const percent = (typePopulation / totalPopulation) * 100 + '%';
		const myStyle = { width: percent };
		return <div className={`demographic demographic-${index}`} style={myStyle} key={index} />;
	});
};

export function DataChart(props) {
	return <div className="demographics">{renderList(props.districtNew, props.districtOld)}</div>;
}
