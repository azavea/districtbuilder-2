import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { DataChart } from './DataChart';
import { DistrictColorSymbol } from './DistrictColorSymbol';
import LockButton from './LockButton';
import { DistrictCompactnessScore } from './DistrictCompactnessScore';
import { selectDistrict, acceptChanges, rejectChanges, lockDistrict } from '../actions';
import { diffColors } from '../constants/colors';
import { districtsTemplate, idealNumber } from '../constants';
import { numberWithCommas } from '../util/data';
import { calculatePopulationsOld, calculatePopulationsNew } from '../util/sidebar';

class DistrictsSidebar extends Component {
	componentDidMount() {
		this.calculatePopulationsOldMemoized = memoize(calculatePopulationsOld, {
			max: 1,
			primitive: true,
			length: 1,
		});
	}
	renderList() {
		if (this.props.districts && window.dataFeatures) {
			const districtsBaseData = this.calculatePopulationsOldMemoized(
				this.props.districts,
				window.dataFeatures,
				districtsTemplate
			);
			console.log(districtsBaseData);
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
				const diff = districtNew.population !== 0;
				const isZeroDistrict = index === 0;
				const deviation = isZeroDistrict
					? districtOld.population + districtNew.population
					: districtOld.population + districtNew.population - idealNumber;
				const devChartWidth = isZeroDistrict
					? ((districtOld.population + districtNew.population) / idealNumber) * 40
					: ((districtOld.population + districtNew.population) / idealNumber) * 40;
				const devChartWidth2 = devChartWidth > 40 ? 40 - devChartWidth : 0;
				const hasPopChanged = districtNew.population > 0;
				const isNearIdeal =
					Math.abs(idealNumber - (districtOld.population + districtNew.population)) < 10000;

				return (
					<div
						className={`item ${districtStatus} diff-${diff} ideal-${isNearIdeal}`}
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
							<div className="district-population">
								{numberWithCommas(districtOld.population + districtNew.population)}
							</div>
						</div>
						<div className="district-property">
							<div className="district-deviation">
								{deviation > 0 && '+'}
								{numberWithCommas(deviation)}
							</div>
						</div>
						<div className="district-property">
							<div className={`devchart positive-${devChartWidth > 0}`}>
								<div
									className="devchart-pointer-left"
									style={{ width: `${Math.min(Math.abs(devChartWidth), 40)}px` }}
								></div>
								<div
									className="devchart-pointer-right"
									style={{ width: `${Math.min(Math.abs(devChartWidth2), 40)}px` }}
								></div>
							</div>
						</div>
						<div className="district-property">
							{(districtNew.population > 0 || districtOld.population > 0) && (
								<DataChart districtNew={districtNew} districtOld={districtOld} />
							)}
						</div>
						<div className="district-property">
							{!isZeroDistrict ? (
								compactnessScores ? (
									<DistrictCompactnessScore
										haschanged={hasPopChanged}
										score={compactnessScores[index]}
									/>
								) : (
									<span />
								)
							) : (
								<span>—</span>
							)}
						</div>
						<div className="district-property no-padding-right">
							<LockButton index={index} lockedStatus={lockedStatus} />
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
						<div
							className="district-property no-padding-left no-padding-right"
							data-rh="District number"
						>
							Number
						</div>
						<div className="district-property text-right" data-rh="Total population">
							Population
						</div>
						<div
							className="district-property text-right"
							data-rh="Deviation from target population"
						>
							Deviation
						</div>
						<div
							className="district-property text-right"
							data-rh="Deviation from target population"
						>
							Chart
						</div>
						<div className="district-property" data-rh="Population by race">
							Race
						</div>
						<div className="district-property" data-rh="District compactness">
							Comp.
						</div>
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
		selectedDistrict: state.historyState.present.selectedDistrict,
		activatedIds: state.activatedIds,
		selectedIds: state.historyState.present.selectedIds,
		districtColors: state.districtColors,
		districts: state.historyState.present.districts,
		lockedIds: state.historyState.present.lockedIds,
		geometry: state.geometry,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSelectDistrict: districtId => dispatch(selectDistrict(districtId)),
		onLockDistrict: districtId => dispatch(lockDistrict(districtId)),
		onAcceptChanges: () => dispatch(acceptChanges()),
		onRejectChanges: () => dispatch(rejectChanges()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DistrictsSidebar);
