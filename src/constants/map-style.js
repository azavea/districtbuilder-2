import { geounitLayerName, countyLayerName, districtColors, districtIds } from '../constants';
import { generateDistrictColor } from '../util/map';

import { mapStyles } from '../constants';

const districtColorDefinition = generateDistrictColor(districtIds, districtColors);

export const mapboxStyle = {
  version: 8,
  name: 'District Builder',
  sources: {
    districts: {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[]] },
      },
    },
    blockgroups: {
      type: 'vector',
      tiles: [window.location.origin + '/data/tiles/{z}/{x}/{y}.pbf'],
      minzoom: 0,
      maxzoom: 12,
    },
    highlight: {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[]] },
      },
    },
  },
  layers: [
    {
      id: 'districts-fill',
      type: 'fill',
      source: 'districts',
      paint: {
        'fill-color': districtColorDefinition,
        'fill-opacity': mapStyles.default.districtsFillOpacity,
      },
    },
    {
      id: 'districts-line',
      type: 'line',
      source: 'districts',
      paint: {
        'line-color': districtColorDefinition,
        'line-opacity': 1,
        'line-width': 5,
        'line-offset': 3,
      },
      layout: {
        visibility: mapStyles.default.districtsLineVisibility,
      },
    },
    {
      id: 'geounits-choropleth',
      type: 'fill',
      source: 'blockgroups',
      'source-layer': geounitLayerName,
      paint: {
        'fill-color': '#000',
      },
      layout: {
        visibility: 'none',
      },
    },
    {
      id: 'geounits-fill',
      type: 'fill',
      source: 'blockgroups',
      'source-layer': geounitLayerName,
      paint: {
        'fill-color': 'transparent',
      },
    },
    {
      id: 'counties-fill',
      type: 'fill',
      source: 'blockgroups',
      'source-layer': countyLayerName,
      paint: {
        'fill-color': 'transparent',
      },
    },
    {
      id: 'counties-outline',
      type: 'line',
      source: 'blockgroups',
      'source-layer': countyLayerName,
      paint: {
        'line-color': '#000',
        'line-opacity': 1,
        'line-width': ['interpolate', ['linear'], ['zoom'], 0, 1, 4, 1.5, 12, 4],
      },
    },
    {
      id: 'counties-outline-highlight',
      type: 'fill',
      source: 'blockgroups',
      'source-layer': countyLayerName,
      paint: {
        'fill-color': '#000',
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.1, 0],
      },
    },
    {
      id: 'blockgroups-outline',
      type: 'line',
      source: 'blockgroups',
      'source-layer': geounitLayerName,
      paint: {
        'line-color': '#000',
        'line-opacity': mapStyles.default.blockgroupsLineOpacity,
        'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 12, 2],
      },
      layout: {
        visibility: 'none',
      },
    },
    // {
    //   id: 'blockgroups-outline-highlight',
    //   type: 'fill',
    //   source: 'blockgroups',
    //   'source-layer': geounitLayerName,
    //   paint: {
    //     'fill-color': '#000',
    //     'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.1, 0],
    //   },
    // },
    {
      id: 'districts-lock',
      type: 'fill',
      source: 'districts',
      paint: {
        'fill-opacity': 1,
        'fill-pattern': 'circle-1',
      },
      filter: ['in', 'district', -1],
    },
    {
      id: 'highlight-fill',
      type: 'fill',
      source: 'highlight',
      paint: {
        'fill-color': '#000',
        'fill-opacity': 0.5,
      },
    },
    {
      id: 'highlight-line',
      type: 'line',
      source: 'highlight',
      paint: {
        'line-color': '#000',
        'line-opacity': 1,
        'line-width': 5,
      },
    },
    {
      id: 'town-small',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'towns',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
    {
      id: 'town-medium',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'townm',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
    {
      id: 'town-large',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'townl',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
    {
      id: 'city-small',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'citys',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
    {
      id: 'city-medium',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'citym',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
    {
      id: 'city-large',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'cityl',
      layout: {
        'text-size': 16,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
    {
      id: 'geounit-population-labels',
      type: 'symbol',
      minzoom: 8,
      source: 'blockgroups',
      'source-layer': 'geounitlabels',
      layout: {
        'text-size': 12,
        'symbol-spacing': 1,
        'text-padding': 3,
        'text-field': '{native}',
        'text-max-width': 7,
        'text-font': ['GR'],
        visibility: 'none',
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
    {
      id: 'county-population-labels',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'countylabels',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 3,
        'text-field': '{population}',
        'text-max-width': 7,
        'text-font': ['GR'],
        visibility: 'none',
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
    {
      id: 'county-name-labels',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'countylabels',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 3,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
        visibility: 'none',
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': 1.25,
        'text-halo-blur': 0,
      },
    },
  ],
  sprite: window.location.origin + '/data/sprites/sprite',
  glyphs: window.location.origin + '/data/fonts/{fontstack}/{range}.pbf',
};

export const drawStyle = [
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#444',
      'line-width': 1,
    },
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#444',
      'fill-opacity': 0.4,
    },
  },
];
