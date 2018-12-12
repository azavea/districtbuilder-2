import { colorOptionsSmall, colorOptionsLarge } from './colors';

export const topoObjectName = 'pa-bg';

export const topoUrl = 'data/pa-bg.topojson';

export const tileLocation = [
  window.location.origin + window.location.pathname + '/data/tiles/{z}/{x}/{y}.pbf',
];

export const tileLayerName = 'geounitlines';

export const populationTypes = ['population', 'white', 'black', 'native', 'asian'];
export const districtNum = 18;
export const bucketNum = districtNum + 1;
export const districtIds = [...Array(bucketNum).keys()];
export const lockedIdsTemplate = [...Array(bucketNum)];
export const districtColors = districtIds.map(key => {
  console.log(districtIds.length, colorOptionsSmall.length);
  return districtIds.length <= colorOptionsSmall.length
    ? colorOptionsSmall[key]
    : colorOptionsLarge[key];
});

export const districtsTemplate = districtIds.map(key => {
  const name = key > 0 ? key : '∅';
  return {
    id: key,
    name: name,
    population: 0,
    white: 0,
    black: 0,
    asian: 0,
    native: 0,
  };
});
