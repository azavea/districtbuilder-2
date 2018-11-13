import { colorOptionsSmall, colorOptionsLarge } from './colors';

// export const topoObjectName = 'units';
export const topoObjectName = 'pa';

// export const jsonUrl = 'data/bg.json';
export const jsonUrl = 'data/pa.json';

// export const topoUrl = 'data/bg.topojson';
export const topoUrl = 'data/pa.topojson';

// export const tileLocation = [
//  window.location.origin + window.location.pathname + '/data/tiles/{z}/{x}/{y}.pbf'
// ];
// export const tileLayerName = 'bg';
export const tileLocation = [
  window.location.origin + window.location.pathname + '/data/tiles-pa/{z}/{x}/{y}.pbf',
];
export const tileLayerName = 'pa';

export const populationTypes = ['population', 'white', 'black', 'native', 'asian', 'other'];

export const districtNum = 18;

export const bucketNum = districtNum + 1;

export const districtColorsDefault = [...Array(bucketNum).keys()].map(key => {
  return colorOptionsSmall[key];
});

export const districtsTemplate = [
  {
    id: 0,
    name: '∅',
    population: 0,
    white: 0,
    black: 0,
    asian: 0,
    native: 0,
    other: 0,
  },
  ...[...Array(districtNum).keys()].map(key => {
    return {
      id: key + 1,
      name: `${key + 1}`,
      population: 0,
      white: 0,
      black: 0,
      asian: 0,
      native: 0,
      other: 0,
    };
  }),
];
