import React from 'react';

function renderOptions(id, action, options, selectedOption) {
  return options.map((option, index) => {
    return (
      <label key={index}>
        <input
          type="radio"
          value={option.id}
          name={id}
          checked={option.id === selectedOption}
          onChange={() => action(option.id)}
        />
        {option.text}
      </label>
    );
  });
}

export function OptionRadio(props) {
  return renderOptions(props.id, props.action, props.options, props.selectedOption);
}
