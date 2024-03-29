import React from 'react';
import { numberWithCommas } from '../util/data';

export const rectTooltipHtml = activeIds => {
	let popTotal = {
		number: 0,
		race: [
			{ name: 'white', number: 0, percent: undefined },
			{ name: 'black', number: 0, percent: undefined },
			{ name: 'asian', number: 0, percent: undefined },
			{ name: 'hispanic', number: 0, percent: undefined },
			{ name: 'other', number: 0, percent: undefined },
		],
	};
	activeIds.forEach(id => {
		const geounit = window.dataFeatures[id];
		if (geounit) {
			popTotal.number += geounit.population;
			popTotal.race.forEach(population => {
				population.number += geounit[population.name];
			});
		}
		popTotal.race.forEach(population => {
			population.percent = `${(population.number / popTotal.number) * 100}%`;
		});
	});
	let html;
	if (popTotal.number > 0) {
		html = (
			<span>
				<div className="fixed-title">{numberWithCommas(activeIds.length)} blockgroups</div>
				<div className="population">{numberWithCommas(popTotal.number)}</div>
				<div className="chart">
					<div className="demographics">
						<div className="demographic-item">
							<div className="demographic-label">White</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-0"
									style={{ width: popTotal.race[0].percent }}
								/>
							</div>
						</div>
						<div className="demographic-item">
							<div className="demographic-label">Black</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-1"
									style={{ width: popTotal.race[1].percent }}
								/>
							</div>
						</div>
						<div className="demographic-item">
							<div className="demographic-label">Asian</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-2"
									style={{ width: popTotal.race[2].percent }}
								/>
							</div>
						</div>
						<div className="demographic-item">
							<div className="demographic-label">Hispanic</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-3"
									style={{ width: popTotal.race[3].percent }}
								/>
							</div>
						</div>
						<div className="demographic-item">
							<div className="demographic-label">Other</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-4"
									style={{ width: popTotal.race[4].percent }}
								/>
							</div>
						</div>
					</div>
				</div>
			</span>
		);
	} else {
		html = <div className="popup-zero-population">Draw your cursor to draw a rectangle</div>;
	}
	return html;
};

export const pointerTooltipHtml = (id, feature, selectionLevel) => {
	const properties = feature.properties;
	const popTotal = properties.population;
	const popWhitePercent = (properties.white / properties.population) * 100;
	const popBlackPercent = (properties.black / properties.population) * 100;
	const popAsianPercent = (properties.asian / properties.population) * 100;
	const popHispanicPercent = (properties.hispanic / properties.population) * 100;
	const popOtherPercent = (properties.other / properties.population) * 100;
	if (properties.population > 0) {
		let title;
		if (selectionLevel === 'county') {
			title = `${properties.name} County`;
		} else {
			title = `Block Group #${properties.blockgroup_id}`;
		}
		return (
			<div>
				<div className="fixed-title">{title}</div>
				<div className="population">{numberWithCommas(popTotal)}</div>
				<div className="chart">
					<div className="demographics">
						<div className="demographic-item">
							<div className="demographic-label">White</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-0"
									style={{ width: `${popWhitePercent}%` }}
								/>
							</div>
						</div>
						<div className="demographic-item">
							<div className="demographic-label">Black</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-1"
									style={{ width: `${popBlackPercent}%` }}
								/>
							</div>
						</div>
						<div className="demographic-item">
							<div className="demographic-label">Asian</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-2"
									style={{ width: `${popAsianPercent}%` }}
								/>
							</div>
						</div>
						<div className="demographic-item">
							<div className="demographic-label">Hispanic</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-3"
									style={{ width: `${popHispanicPercent}%` }}
								/>
							</div>
						</div>
						<div className="demographic-item">
							<div className="demographic-label">Other</div>
							<div className="demographic-bar">
								<div
									className="demographic demographic-4"
									style={{ width: `${popOtherPercent}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return <div className="popup-zero-population">This area has zero population</div>;
	}
};
