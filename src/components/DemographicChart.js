import React, { Component } from 'react';

import { populationTypes } from '../constants';

export class DemographicChart extends Component {
	renderList() {
		const totalPopulation =
			this.props.districtNew.population + this.props.districtOld.population;
		return populationTypes.slice(1).map((type, index) => {
			const typePopulation = this.props.districtNew[type] + this.props.districtOld[type];
			const percent = (typePopulation / totalPopulation) * 100 + '%';
			const myStyle = { width: percent };
			return (
				<div className={`demographic demographic-${index}`} style={myStyle} key={index} />
			);
		});
	}

	render() {
		return <div className="demographics">{this.renderList()}</div>;
	}
}
