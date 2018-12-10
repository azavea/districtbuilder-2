import React from 'react';

function renderOptions(action, options, selectedOption) {
	return options.map((option, index) => {
		const status = option === selectedOption ? ' selected' : '';
		return (
			<option className={'map-action' + status} key={index}>
				{option}
			</option>
		);
	});
}

export function OptionSelect(props) {
	return (
		<select onChange={e => props.action(e.target.value)}>
			{renderOptions(props.action, props.options, props.selectedOption)}
		</select>
	);
}
