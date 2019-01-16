import React from 'react';

export const optionsDrawMode = [
	{
		id: 'pointer',
		name: (
			<span>
				<i className="icon-hand-pointer" />
			</span>
		),
		tooltip: 'Use pointer tool',
	},
	{
		id: 'rectangle',
		name: (
			<span>
				<i className="icon-draw-square" />
			</span>
		),
		tooltip: 'Use rectangle draw tool',
	},
];

export const optionsSelectionLevel = [
	{ id: 'county', name: 'Counties', tooltip: 'Select counties' },
	{ id: 'geounit', name: 'Block groups', tooltip: 'Select block groups' },
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

export const optionsMapLabels = [
	{
		text: 'none',
		value: 'none',
	},
	{
		type: 'separator',
		value: 'separator1',
	},
	{
		text: 'city names',
		value: 'city',
	},
	{
		text: 'county names',
		value: 'county',
	},
	{
		type: 'separator',
		value: 'separator2',
	},
	{
		text: 'total population',
		value: 'pop-population',
	},
	{
		text: 'white population',
		value: 'pop-white',
	},
	{
		text: 'black population',
		value: 'pop-black',
	},
	{
		text: 'asian population',
		value: 'pop-asian',
	},
	{
		text: 'native population',
		value: 'pop-native',
	},
	{
		text: 'other population',
		value: 'pop-other',
	},
];

export const optionsMapBasemap = [
	{
		text: 'none',
		value: 'none',
		image: { avatar: true, src: '/images/basemap-none.jpg' },
	},
	{
		text: 'satellite',
		value: 'satellite',
		image: { avatar: true, src: '/images/basemap-satellite.jpg' },
	},
	{
		text: 'topography',
		value: 'topography',
		image: { avatar: true, src: '/images/basemap-topography.jpg' },
	},
	{
		text: 'streets',
		value: 'streets',
		image: { avatar: true, src: '/images/basemap-streets.jpg' },
	},
];

export const optionsDrawLimit = 'Limit to county';

export const optionsMapCountyName = 'County name';
