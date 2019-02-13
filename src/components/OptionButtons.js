import React from 'react';

function renderOptions(action, options, selectedOption) {
	return options.map((option, index) => {
		const status = option.value === selectedOption ? ' selected' : '';
		return (
			<button
				className={'map-action' + status}
				key={index}
				data-rh={option.tooltip}
				onClick={() => action(option.value)}
			>
				{option.text}
			</button>
		);
	});
}

export function OptionButtons(props) {
	return (
		<div className="button-group">
			{renderOptions(props.action, props.options, props.selectedOption)}
		</div>
	);
}
