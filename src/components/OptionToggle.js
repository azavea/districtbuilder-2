import React from 'react';

export function OptionToggle(props) {
    const status = props.selectedOption ? '-check-square' : '-square';
    return (
        <button onClick={() => props.action(!props.selectedOption)}>
            <i className={'icon' + status} /> {props.options}
        </button>
    );
}
