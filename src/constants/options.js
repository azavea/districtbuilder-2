import React from 'react';

export const optionsDrawMode = [
	{
		value: 'pointer',
		text: (
			<span>
				<i className="icon-hand-pointer" />
			</span>
		),
		tooltip: 'Use pointer tool',
	},
	{
		value: 'rectangle',
		text: (
			<span>
				<i className="icon-draw-square" />
			</span>
		),
		tooltip: 'Use rectangle draw tool',
	},
];

export const optionsSelectionLevel = [
	{ value: 'county', text: 'Counties', tooltip: 'Select counties' },
	{ value: 'geounit', text: 'Block groups', tooltip: 'Select block groups' },
];

export const optionsMapChoropleth = [
	{ value: 'off', text: 'Circle: Off' },
	{ value: 'population', text: 'Population' },
	{ value: 'white', text: 'White' },
	{ value: 'black', text: 'Black' },
	{ value: 'asian', text: 'Asian' },
	{ value: 'native', text: 'Native' },
	{ value: 'other', text: 'Other' },
];

export const optionsMapNumber = [
	{ value: 'off', text: 'Number: Off' },
	{ value: 'population', text: 'Population' },
	{ value: 'white', text: 'White' },
	{ value: 'black', text: 'Black' },
	{ value: 'asian', text: 'Asian' },
	{ value: 'native', text: 'Native' },
	{ value: 'other', text: 'Other' },
];

export const optionsPopup = [
	{
		text: 'none',
		value: 'none',
	},
	{
		type: 'separator',
		value: 'separator1',
	},
	{
		text: 'compact',
		value: 'compact',
	},
	{
		text: 'fixed, left',
		value: 'fixed-left',
	},
	{
		text: 'fixed, right',
		value: 'fixed-right',
	},
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
		type: 'raster',
		image: { avatar: true, src: '/images/basemap-none.jpg' },
	},
	{
		text: 'satellite',
		value: 'satellite',
		type: 'raster',
		image: { avatar: true, src: '/images/basemap-satellite.jpg' },
	},
	{
		text: 'topography',
		value: 'topography',
		type: 'raster',
		image: { avatar: true, src: '/images/basemap-topography.jpg' },
	},
	{
		text: 'streets',
		value: 'streets',
		type: 'raster',
		image: { avatar: true, src: '/images/basemap-streets.jpg' },
	},
	{
		type: 'separator',
		value: 'separator1',
	},
	{
		text: 'total',
		value: 'total',
		type: 'choropleth',
	},
	{
		text: 'white',
		value: 'white',
		type: 'choropleth',
	},
	{
		text: 'black',
		value: 'black',
		type: 'choropleth',
	},
	{
		text: 'asian',
		value: 'asian',
		type: 'choropleth',
	},
	{
		text: 'native',
		value: 'native',
		type: 'choropleth',
	},
	{
		text: 'other',
		value: 'other',
		type: 'choropleth',
	},
];

export const optionsDrawLimit = 'Limit to county';

export const optionsMapCountyName = 'County name';
