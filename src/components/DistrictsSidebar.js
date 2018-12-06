import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { DemographicChart } from '../components/DemographicChart';
import { DistrictColorSymbol } from '../components/DistrictColorSymbol';
import { selectDistrict, acceptChanges, lockDistrict } from '../actions';

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
				const districtStatus = index === this.props.selectedDistrict ? ' selected' : '';
				const lockedStatus = this.props.lockedIds[index] ? '-locked' : '-unlocked';
				const diff =
					districtNew.population > 0
						? diffColors.increase
						: districtNew.population < 0
						? diffColors.decrease
						: diffColors.nochange;
				return (
					<div
						className={'item' + districtStatus}
						key={index}
						onClick={() => this.onSelectDistrict(index)}
					>
						<div className="item-container">
							<DistrictColorSymbol color={color} />
							<div className="district-name">{districtNew.name}</div>
							<div className="district-population" style={{ color: diff }}>
								{numberWithCommas(districtOld.population + districtNew.population)}
							</div>
							<DemographicChart districtNew={districtNew} districtOld={districtOld} />
							<button
								className={'button-lock .' + lockedStatus}
								onClick={e => this.onLockDistrict(e, index)}
							>
								<i className={'icon-lock' + lockedStatus} />
							</button>
						</div>
					</div>
				);
			});
		}
	}

	onLockDistrict = (e, index) => {
		e.stopPropagation();
		this.props.onLockDistrict(index);
	};

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
		lockedIds: state.lockedIds,
	};
};

const mapActionsToProps = {
	onSelectDistrict: selectDistrict,
	onAcceptChanges: acceptChanges,
	onLockDistrict: lockDistrict,
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(DistrictsSidebar);
