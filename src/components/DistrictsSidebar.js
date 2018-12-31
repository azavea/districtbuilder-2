import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { DataChart } from '../components/DataChart';
import { DistrictColorSymbol } from '../components/DistrictColorSymbol';
import { DistrictCompactnessScore } from '../components/DistrictCompactnessScore';
import { selectDistrict, acceptChanges, rejectChanges, lockDistrict } from '../actions';

import { diffColors } from '../constants/colors';

import { districtsTemplate, idealNumber } from '../constants';

import { numberWithCommas, calculatePopulationsOld, calculatePopulationsNew } from '../util';

class DistrictsSidebar extends Component {
	componentWillMount() {
		this.calculatePopulationsOldMemoized = memoize(calculatePopulationsOld, {
			max: 1,
			primitive: true,
			length: 1,
		});

		this.calculatePopulationsNewMemoized = memoize(calculatePopulationsNew, {
			max: 2,
			primitive: true,
			length: 4,
		});
	}
	renderList() {
		if (this.props.districts && window.dataFeatures) {
			const districtsBaseData = this.calculatePopulationsOldMemoized(
				this.props.districts,
				window.dataFeatures,
				districtsTemplate
			);
			const districtsChangeData = calculatePopulationsNew(
				this.props.selectedIds,
				this.props.activatedIds,
				this.props.selectedDistrict,
				this.props.districts,
				window.dataFeatures,
				districtsTemplate
			);
			return districtsChangeData.map((districtNew, index) => {
				const districtOld = districtsBaseData[index];
				const color = this.props.districtColors[index];
				const districtStatus = index === this.props.selectedDistrict ? 'selected' : '';
				const lockedStatus = this.props.lockedIds[index] ? '-locked' : '-unlocked';
				const compactnessScores = this.props.geometry;
				const diff =
					districtNew.population > 0
						? diffColors.increase
						: districtNew.population < 0
						? diffColors.decrease
						: diffColors.nochange;
				const deviation = districtOld.population + districtNew.population - idealNumber;
				return (
					<div
						className={'item ' + districtStatus}
						key={index}
						tabIndex="0"
						onClick={() => this.onSelectDistrict(index)}
					>
						<div className="district-property district-background">
							<div className="district-background-left" />
						</div>
						<div className="district-property no-padding-left">
							<DistrictColorSymbol color={color} />
							<div className="district-name">{districtNew.name}</div>
						</div>
						<div className="district-property">
							<div className="district-population" style={{ color: diff }}>
								{numberWithCommas(districtOld.population + districtNew.population)}
							</div>
						</div>
						<div className="district-property">
							<div className="district-deviation" style={{ color: diff }}>
								{deviation > 0 && '+'}
								{numberWithCommas(deviation)}
							</div>
						</div>
						<div className="district-property">
							{(districtNew.population > 0 || districtOld.population > 0) && (
								<DataChart districtNew={districtNew} districtOld={districtOld} />
							)}
						</div>
						<div className="district-property">
							{index !== 0 && districtNew.population === 0 && compactnessScores ? (
								<DistrictCompactnessScore score={compactnessScores[index]} />
							) : (
								'–'
							)}
						</div>
						<div className="district-property no-padding-right">
							<button
								className={'button-lock ' + lockedStatus}
								onClick={e => this.onLockDistrict(e, index)}
							>
								<i className={'icon-lock' + lockedStatus} />
							</button>
						</div>
						<div className="district-property district-background">
							<div className="district-background-right" />
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

	onRejectChanges = () => {
		this.props.onRejectChanges();
	};

	onSelectDistrict = title => {
		this.props.onSelectDistrict(title);
	};

	render() {
		const hasChanged = this.props.selectedIds.length > 0 ? 'changed' : '';
		return (
			<div className="sidebar">
				<h2>Districts</h2>
				<div className={'button-group ' + hasChanged}>
					<button className="button-reject" onClick={() => this.onRejectChanges()}>
						Reject
					</button>
					<button className="button-accept" onClick={() => this.onAcceptChanges()}>
						<i className="icon-check" /> Accept
					</button>
				</div>
				<div className="district-table">
					<div className="table-header">
						<div className="district-property district-background" />
						<div className="district-property no-padding-left no-padding-right">
							Number
						</div>
						<div className="district-property text-right">Population</div>
						<div className="district-property text-right">Deviation</div>
						<div className="district-property">Race</div>
						<div className="district-property">Comp.</div>
						<div className="district-property no-padding-left no-padding-right" />
						<div className="district-property district-background" />
					</div>
					{this.renderList()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedDistrict: state.selectedDistrict.present,
		activatedIds: state.activatedIds,
		selectedIds: state.selectedIds.present,
		districtColors: state.districtColors,
		districts: state.districts.present,
		lockedIds: state.lockedIds.present,
		geometry: state.geometry,
	};
};

const mapActionsToProps = {
	onSelectDistrict: selectDistrict,
	onAcceptChanges: acceptChanges,
	onRejectChanges: rejectChanges,
	onLockDistrict: lockDistrict,
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(DistrictsSidebar);
