import React from 'react';

function renderOptions(action, options) {
	return options.map((option, index) => {
		return (
			<option value={option.id} key={index}>
				{option.text}
			</option>
		);
	});
}

export function OptionSelect(props) {
	return (
		<select defaultValue={props.selectedOption} onChange={e => props.action(e.target.value)}>
			{renderOptions(props.action, props.options, props.selectedOption)}
		</select>
	);
}
