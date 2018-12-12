import { tileLocation, tileLayerName, districtColors, districtIds } from '../constants';
import { generateDistrictColor } from '../util/map';
import { numberWithCommas } from '../util/data';

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
      tiles: tileLocation,
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
        'fill-opacity': 1,
      },
    },
    {
      id: 'districts-extrusion',
      type: 'fill-extrusion',
      source: 'districts',
      paint: {
        'fill-extrusion-height': ['get', 'popw'],
      },
    },
    {
      id: 'blockgroups-fill',
      type: 'fill',
      source: 'blockgroups',
      'source-layer': tileLayerName,
      paint: {
        // 'fill-color': '#000',
        'fill-color': 'transparent',
        // 'fill-opacity': ['match', ['get', 'popw'], 3, 0.4, 2, 0.2, 1, 0, 0],
      },
    },
    {
      id: 'counties-fill',
      type: 'fill',
      source: 'blockgroups',
      'source-layer': 'countylines',
      paint: {
        'fill-color': 'transparent',
        // 'fill-opacity': ['match', ['get', 'popw'], 3, 0.4, 2, 0.2, 1, 0, 0],
      },
    },
    {
      id: 'counties-outline',
      type: 'line',
      source: 'blockgroups',
      'source-layer': 'countylines',
      paint: {
        'line-color': '#000',
        'line-opacity': 1,
        'line-width': 1.5,
      },
    },
    {
      id: 'blockgroups-outline',
      type: 'line',
      source: 'blockgroups',
      'source-layer': tileLayerName,
      paint: {
        'line-color': '#000',
        'line-opacity': 0.2,
        'line-width': 1,
      },
      layout: {
        visibility: 'none',
      },
    },
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
        'text-size': 10,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#fff',
        'text-opacity': 0.9,
        'text-halo-color': {
          base: 1,
          stops: [[8, 'hsl(0, 1%, 10%)'], [16, 'hsl(0, 2%, 16%)']],
        },
        'text-halo-width': {
          base: 1,
          stops: [[14, 1.25], [15, 1.5]],
        },
        'text-halo-blur': 0,
      },
    },
    {
      id: 'town-medium',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'townm',
      layout: {
        'text-size': 10,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#fff',
        'text-opacity': 0.9,
        'text-halo-color': {
          base: 1,
          stops: [[8, 'hsl(0, 1%, 10%)'], [16, 'hsl(0, 2%, 16%)']],
        },
        'text-halo-width': {
          base: 1,
          stops: [[14, 1.25], [15, 1.5]],
        },
        'text-halo-blur': 0,
      },
    },
    {
      id: 'town-large',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'townl',
      layout: {
        'text-size': 10,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#fff',
        'text-opacity': 0.9,
        'text-halo-color': {
          base: 1,
          stops: [[8, 'hsl(0, 1%, 10%)'], [16, 'hsl(0, 2%, 16%)']],
        },
        'text-halo-width': {
          base: 1,
          stops: [[14, 1.25], [15, 1.5]],
        },
        'text-halo-blur': 0,
      },
    },
    {
      id: 'city-small',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'citys',
      layout: {
        'text-size': 12,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#fff',
        'text-opacity': 0.9,
        'text-halo-color': {
          base: 1,
          stops: [[8, 'hsl(0, 1%, 10%)'], [16, 'hsl(0, 2%, 16%)']],
        },
        'text-halo-width': {
          base: 1,
          stops: [[14, 1.25], [15, 1.5]],
        },
        'text-halo-blur': 0,
      },
    },
    {
      id: 'city-medium',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'citym',
      layout: {
        'text-size': 12,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#fff',
        'text-opacity': 0.9,
        'text-halo-color': {
          base: 1,
          stops: [[8, 'hsl(0, 1%, 10%)'], [16, 'hsl(0, 2%, 16%)']],
        },
        'text-halo-width': {
          base: 1,
          stops: [[14, 1.25], [15, 1.5]],
        },
        'text-halo-blur': 0,
      },
    },
    {
      id: 'city-large',
      type: 'symbol',
      source: 'blockgroups',
      'source-layer': 'cityl',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 20,
        'text-field': '{name}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#fff',
        'text-opacity': 0.9,
        'text-halo-color': {
          base: 1,
          stops: [[8, 'hsl(0, 1%, 10%)'], [16, 'hsl(0, 2%, 16%)']],
        },
        'text-halo-width': {
          base: 1,
          stops: [[14, 1.25], [15, 1.5]],
        },
        'text-halo-blur': 0,
      },
    },
    {
      id: 'county-labels',
      type: 'symbol',
      minzoom: 8,
      source: 'blockgroups',
      'source-layer': 'geounitlabels',
      layout: {
        'text-size': 12,
        'symbol-spacing': 1,
        'text-padding': 10,
        'text-field': '{population}',
        'text-max-width': 7,
        'text-font': ['GR'],
      },
      paint: {
        'text-color': '#fff',
        'text-opacity': 0.9,
        'text-halo-color': {
          base: 1,
          stops: [[8, 'hsl(0, 1%, 10%)'], [16, 'hsl(0, 2%, 16%)']],
        },
        'text-halo-width': {
          base: 1,
          stops: [[14, 1.25], [15, 1.5]],
        },
        'text-halo-blur': 0,
      },
    },
  ],
  sprite: window.location.origin + window.location.pathname + '/sprites/sprite',
  glyphs: window.location.origin + window.location.pathname + '/data/fonts/{fontstack}/{range}.pbf',
};
