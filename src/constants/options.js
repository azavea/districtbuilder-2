import React from 'react';

export const optionsDrawMode = [
	{
		value: 'pointer',
		text: <i className="icon-hand-pointer" />,
		tooltip: 'Use pointer tool',
	},
	{
		value: 'rectangle',
		text: <i className="icon-draw-square" />,
		tooltip: 'Use rectangle draw tool',
	},
	{
		value: 'paintbrush',
		text: <i className="icon-paint-brush" />,
		tooltip: 'Use brush tool',
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
		type: 'title',
		value: 'title1',
		text: 'Places',
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
		type: 'title',
		value: 'title2',
		text: 'Population',
	},
	{
		text: 'total',
		value: 'pop',
	},
	{
		text: 'white',
		value: 'pop-white',
	},
	{
		text: 'black',
		value: 'pop-black',
	},
	{
		text: 'asian',
		value: 'pop-asian',
	},
	{
		text: 'native',
		value: 'pop-native',
	},
	{
		text: 'other',
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
		type: 'separator',
		value: 'separator1',
	},
	{
		type: 'title',
		value: 'title1',
		text: 'Imagery',
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
		value: 'separator2',
	},
	{
		type: 'title',
		value: 'title2',
		text: 'Population',
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
