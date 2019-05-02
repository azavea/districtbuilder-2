import React from 'react';

const renderScore = score => {
	if (score === -1) {
		return <i data-rh="Non-contiguous (invalid)" className="icon-times-circle" />;
	}
	if (score) {
		return <div data-rh="Polsby-Popper score">{Math.round(score * 100)}%</div>;
	}
	return <div data-rh="Empty district" />;
};

export function DistrictCompactnessScore(props) {
	const style = props.haschanged ? { opacity: 0.5 } : {};
	return (
		<div style={style} className="district-compactness-score">
			{renderScore(props.score)}
		</div>
	);
}
