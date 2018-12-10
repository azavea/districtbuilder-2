import React from 'react';

function renderOptions(action, options, selectedOption) {
	return options.map((option, index) => {
		const status = option === selectedOption ? ' selected' : '';
		return (
			<button className={'map-action' + status} key={index} onClick={() => action(option)}>
				{option}
			</button>
		);
	});
}

export function OptionButtons(props) {
	return renderOptions(props.action, props.options, props.selectedOption);
}
