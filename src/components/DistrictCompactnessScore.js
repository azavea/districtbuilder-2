import React from 'react';

const renderScore = score => {
	if (score === -1) {
		return <i className="icon-times-circle" />;
	}
	if (score) {
		return `${Math.round(score * 100)}%`;
	}
	return '–';
};

export function DistrictCompactnessScore(props) {
	return (
		<div data-rh="Compactness info display" className="district-compactness-score">
			{renderScore(props.score)}
		</div>
	);
}
