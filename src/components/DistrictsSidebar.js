import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { DemographicChart } from '../components/DemographicChart';
import { DistrictColorSymbol } from '../components/DistrictColorSymbol';
import { selectDistrict, acceptChanges } from '../actions';

import { diffColors } from '../constants/colors';

import { districtsTemplate } from '../constants';

import { numberWithCommas, calculatePopulationsOld, calculatePopulationsNew } from '../util';

class DistrictsSidebar extends Component {
	calculatePopulationsOldMemoized = memoize(calculatePopulationsOld, {
		max: 2,
		primitive: true,
		length: 1,
	});

	calculatePopulationsNewMemoized = memoize(calculatePopulationsNew, {
		max: 5,
		primitive: true,
		length: 4,
	});

	renderList() {
		if (this.props.assignedDistricts && this.props.geometries) {
			const districtsBaseData = this.calculatePopulationsOldMemoized(
				this.props.assignedDistricts,
				this.props.geometries,
				districtsTemplate
			);
			const districtsChangeData = this.calculatePopulationsNewMemoized(
				this.props.selectedIds,
				this.props.activatedIds,
				this.props.selectedDistrict,
				this.props.assignedDistricts,
				this.props.geometries,
				districtsTemplate
			);
			return districtsChangeData.map((districtNew, index) => {
				const districtOld = districtsBaseData[index];
				const color = this.props.districtColors[index];
				const status = districtNew.id === this.props.selectedDistrict ? ' selected' : '';
				const diff =
					districtNew.population > 0
						? diffColors.increase
						: districtNew.population < 0
						? diffColors.decrease
						: diffColors.nochange;
				return (
					<div
						className={'item' + status}
						key={districtNew.id}
						onClick={() => this.onSelectDistrict(districtNew.id)}
					>
						<div className="item-container">
							<DistrictColorSymbol color={color} />
							<div className="district-name">{districtNew.name}</div>
							<div className="district-population" style={{ color: diff }}>
								{numberWithCommas(districtOld.population + districtNew.population)}
							</div>
							<DemographicChart districtNew={districtNew} districtOld={districtOld} />
						</div>
					</div>
				);
			});
		}
	}

	onAcceptChanges = () => {
		this.props.onAcceptChanges();
	};

	onSelectDistrict = title => {
		this.props.onSelectDistrict(title);
	};

	render() {
		return (
			<div className="sidebar">
				<button className="button-accept" onClick={() => this.onAcceptChanges()}>
					Accept changes
				</button>
				<div>{this.renderList()}</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		geometries: state.geometries,
		selectedDistrict: state.selectedDistrict,
		activatedIds: state.activatedIds,
		selectedIds: state.selectedIds,
		districtColors: state.districtColors,
		assignedDistricts: state.assignedDistricts,
	};
};

const mapActionsToProps = {
	onSelectDistrict: selectDistrict,
	onAcceptChanges: acceptChanges,
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(DistrictsSidebar);
