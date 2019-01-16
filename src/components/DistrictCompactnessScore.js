import React from 'react';

const renderScore = score => {
	if (score === -1) {
		return <i data-rh="Non-contiguous (invalid)" className="icon-times-circle" />;
	}
	if (score) {
		return <div data-rh="Polsby-Popper score">{Math.round(score * 100)}%</div>;
	}
	return <div data-rh="Empty district">–</div>;
};

export function DistrictCompactnessScore(props) {
	return <div className="district-compactness-score">{renderScore(props.score)}</div>;
}
