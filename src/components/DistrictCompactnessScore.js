import React from 'react';

const renderScore = score => {
	if (score === -1) {
		return <i className="icon-times-circle" />;
	}
	if (score) {
		return <div className="district-compactness-score">{`${Math.round(score * 100)}%`}</div>;
	}
	return '–';
};

export function DistrictCompactnessScore(props) {
	return <div className="district-compactness-score">{renderScore(props.score)}</div>;
}
