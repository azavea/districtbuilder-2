import { colorOptionsSmall, colorOptionsLarge } from './colors';

export const topoObjectName = 'bg-lines';

export const topoUrl = 'data/bg-lines.topojson';

export const geounitLayerName = 'bglines';
export const countyLayerName = 'countylines';

export const demographicTypes = ['white', 'black', 'asian', 'hispanic', 'other'];
export const populationTypes = ['population', ...demographicTypes];
export const districtNum = 13;
export const bucketNum = districtNum + 1;
export const districtIds = [...Array(bucketNum).keys()];
export const lockedIdsTemplate = [...Array(bucketNum)];
export const districtColors = districtIds.map(key => {
  return districtIds.length <= colorOptionsSmall.length
    ? colorOptionsSmall[key]
    : colorOptionsLarge[key];
});

export const idealNumber = 710583;

export const districtsTemplate = districtIds.map(key => {
  const name = key > 0 ? key : '∅';
  return {
    id: key,
    name: name,
    population: 0,
    white: 0,
    black: 0,
    asian: 0,
    hispanic: 0,
    other: 0,
  };
});

export const mapStyles = {
  default: {
    blockgroupsLineOpacity: ['interpolate', ['linear'], ['zoom'], 0, 0.1, 6, 0.1, 12, 0.2],
    districtsFillOpacity: 1,
    districtsLineVisibility: 'none',
  },
  basemap: {
    blockgroupsLineOpacity: ['interpolate', ['linear'], ['zoom'], 0, 0.1, 6, 0.1, 12, 0.3],
    districtsFillOpacity: ['interpolate', ['linear'], ['zoom'], 0, 0.1, 6, 0.1, 12, 0.4],
    districtsLineVisibility: 'visible',
  },
};

export const removeRasterLayer = map => {
  map
    .setPaintProperty(
      'blockgroups-outline',
      'line-opacity',
      mapStyles.default.blockgroupsLineOpacity
    )
    .setPaintProperty('districts-fill', 'fill-opacity', mapStyles.default.districtsFillOpacity)
    .setLayoutProperty('districts-line', 'visibility', mapStyles.default.districtsLineVisibility);
};

export const addRasterLayer = (map, url) => {
  map
    .addLayer(
      {
        id: 'raster-basemap',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [url],
          tileSize: 256,
        },
      },
      'districts-fill'
    )
    .setPaintProperty(
      'blockgroups-outline',
      'line-opacity',
      mapStyles.basemap.blockgroupsLineOpacity
    )
    .setPaintProperty('districts-fill', 'fill-opacity', mapStyles.basemap.districtsFillOpacity)
    .setLayoutProperty('districts-line', 'visibility', mapStyles.basemap.districtsLineVisibility);
};
