import React from 'react';

export function OptionToggle(props) {
	const { selectedOption, option, action } = props;
	return (
		<label>
			<input onChange={() => action(!selectedOption)} type="checkbox" checked={selectedOption} />
			{option.text}
		</label>
	);
}
