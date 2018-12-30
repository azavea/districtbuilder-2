import React from 'react';

export const optionsDrawMode = [
	{
		id: 'pointer',
		name: (
			<span>
				<i className="icon-hand-pointer" /> Pointer
			</span>
		),
	},
	{
		id: 'rectangle',
		name: (
			<span>
				<i className="icon-draw-square" /> Square
			</span>
		),
	},
];

export const optionsSelectionLevel = [
	{ id: 'county', name: 'Counties' },
	{ id: 'geounit', name: 'Block Groups' },
];

export const optionsMapChoropleth = [
	{ id: 'off', name: 'Circle: Off' },
	{ id: 'population', name: 'Population' },
	{ id: 'white', name: 'White' },
	{ id: 'black', name: 'Black' },
	{ id: 'asian', name: 'Asian' },
	{ id: 'native', name: 'Native' },
	{ id: 'other', name: 'Other' },
];

export const optionsMapNumber = [
	{ id: 'off', name: 'Number: Off' },
	{ id: 'population', name: 'Population' },
	{ id: 'white', name: 'White' },
	{ id: 'black', name: 'Black' },
	{ id: 'asian', name: 'Asian' },
	{ id: 'native', name: 'Native' },
	{ id: 'other', name: 'Other' },
];

export const optionsDrawLimit = 'Limit draw';
