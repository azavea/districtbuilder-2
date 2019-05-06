export const keymap = {
	pointer: {
		description: 'Use pointer tool',
		key: '1',
	},
	rectangle: {
		description: 'Use rectangle tool',
		key: '2',
	},
	paintbrush: {
		description: 'Use paintbrush tool',
		key: '3',
	},
	previousDistrict: {
		description: 'Previous district',
		key: 'w',
	},
	nextDistrict: {
		description: 'Next district',
		key: 's',
	},
	accept: {
		description: 'Accept changes',
		key: 'e',
	},
	reject: {
		description: 'Reject changes',
		key: 'q',
	},
	counties: {
		description: 'Select counties',
		key: 'a',
	},
	geounit: {
		description: 'Select block groups',
		key: 'd',
	},
	undo: {
		description: 'Undo',
		key: 'command+z',
		alt: 'ctrl+z',
	},
	redo: {
		description: 'Redo',
		key: 'shift+command+z',
		alt: 'shift+ctrl+z',
	},
	pan: {
		description: 'Hold to pan map when using brush tool',
		key: 'space',
	},
	toggleDrawCounty: {
		description: 'Limit draw to initial county',
		key: 'c',
	},
	toggleDrawUnassigned: {
		description: 'Limit draw to unassigned',
		key: 'x',
	},
};

export const keymapList = [
	{
		description: keymap.pointer.description,
		keys: [keymap.pointer.key],
	},
	{
		description: keymap.rectangle.description,
		keys: [keymap.rectangle.key],
	},
	{
		description: keymap.paintbrush.description,
		keys: [keymap.paintbrush.key],
	},
	{
		description: keymap.previousDistrict.description,
		keys: [keymap.previousDistrict.key],
	},
	{
		description: keymap.nextDistrict.description,
		keys: [keymap.nextDistrict.key],
	},
	{
		description: keymap.accept.description,
		keys: [keymap.accept.key],
	},
	{
		description: keymap.reject.description,
		keys: [keymap.reject.key],
	},
	{
		description: keymap.counties.description,
		keys: [keymap.counties.key],
	},
	{
		description: keymap.geounit.description,
		keys: [keymap.geounit.key],
	},
	{
		description: keymap.undo.description,
		keys: ['⌘', 'z'],
	},
	{
		description: keymap.redo.description,
		keys: ['shift', '⌘', 'z'],
	},
	{
		description: keymap.toggleDrawCounty.description,
		keys: [keymap.toggleDrawCounty.key],
	},
	{
		description: keymap.toggleDrawUnassigned.description,
		keys: [keymap.toggleDrawUnassigned.key],
	},
	{ description: keymap.pan.description, keys: ['space'] },
];
