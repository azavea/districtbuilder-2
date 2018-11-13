import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { DemographicChart } from '../components/DemographicChart';
import { DistrictColorSymbol } from '../components/DistrictColorSymbol';
import { selectDistrict, acceptChanges } from '../actions';

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
		length: 3,
	});

	// calculatePopulationsOldMemoized = calculatePopulationsOld;

	// calculatePopulationsNewMemoized = calculatePopulationsNew;

	renderList() {
		if (this.props.assignedDistricts && this.props.geometries) {
			const districtsBaseData = this.calculatePopulationsOldMemoized(
				this.props.assignedDistricts,
				this.props.geometries,
				this.props.districts
			);
			const districtsChangeData = this.calculatePopulationsNewMemoized(
				this.props.selectedIds,
				this.props.selectedDistrict,
				this.props.assignedDistricts,
				this.props.districts,
				this.props.geometries
			);
			return districtsChangeData.map((districtNew, index) => {
				const districtOld = districtsBaseData[index];
				const color = this.props.districtColors[index];
				const status = districtNew.id === this.props.selectedDistrict ? ' selected' : '';
				return (
					<div
						className={'item' + status}
						key={districtNew.id}
						onClick={() => this.onSelectDistrict(districtNew.id)}
					>
						<DistrictColorSymbol color={color} />
						<div className="district-name">{districtNew.name}</div>
						<div className="district-population">
							{numberWithCommas(districtOld.population + districtNew.population)}
						</div>
						<DemographicChart districtNew={districtNew} districtOld={districtOld} />
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

const mapStateToProps = (state, props) => {
	return {
		districts: state.districts,
		topoJSON: state.topoJSON,
		geometries: state.geometries,
		selectedDistrict: state.selectedDistrict,
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
