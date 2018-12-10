import React from 'react';

function renderOptions(action, options, selectedOption) {
    return options.map((option, index) => {
        const status = option.id === selectedOption ? ' selected' : '';
        return (
            <button className={'map-action' + status} key={index} onClick={() => action(option.id)}>
                {option.name}
            </button>
        );
    });
}

export function OptionButtons(props) {
    console.log(props);
    return renderOptions(props.action, props.options, props.selectedOption);
}
