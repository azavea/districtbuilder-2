import React from 'react';

import { demographicTypes } from '../constants';

const renderList = (districtNew, districtOld) => {
	const totalPopulation = districtNew.population + districtOld.population;
	return demographicTypes.map((type, index) => {
		const typePopulation = districtNew[type] + districtOld[type];
		const percent = (typePopulation / totalPopulation) * 100 + '%';
		const myStyle = { width: percent };
		console.log(type, typePopulation, totalPopulation);
		return <div className={`demographic demographic-${index}`} style={myStyle} key={index} />;
	});
};

export function DataChart(props) {
	return (
		<div data-rh="More details about charts" className="demographics">
			{renderList(props.districtNew, props.districtOld)}
		</div>
	);
}
