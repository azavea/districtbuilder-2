import { tileLayerName, districtColors, districtIds } from '../constants';
import { generateDistrictColor } from '../util/map';

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
      tiles: [window.location.origin + window.location.pathname + '/data/tiles/{z}/{x}/{y}.pbf'],
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
    // {
    //   id: 'districts-extrusion',
    //   type: 'fill-extrusion',
    //   source: 'districts',
    //   paint: {
    //     'fill-extrusion-height': ['get', 'popw'],
    //   },
    // },
    {
      id: 'blockgroups-fill',
      type: 'fill',
      source: 'blockgroups',
      'source-layer': tileLayerName,
      paint: {
        'fill-color': 'transparent',
      },
    },
    {
      id: 'counties-fill',
      type: 'fill',
      source: 'blockgroups',
      'source-layer': 'countylines',
      paint: {
        'fill-color': 'transparent',
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
      id: 'geounit-circles',
      type: 'circle',
      source: 'blockgroups',
      'source-layer': 'geounitlabels',
      layout: {
        visibility: 'none',
      },
      paint: {
        'circle-color': '#03034f',
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.1, 12, 0.6, 22, 0.6],
        'circle-radius': 0,
      },
    },
    {
      id: 'county-circles',
      type: 'circle',
      source: 'blockgroups',
      'source-layer': 'countylabels',
      layout: {
        visibility: 'none',
      },
      paint: {
        'circle-color': '#03034f',
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.1, 12, 0.6, 22, 0.6],
        'circle-radius': 0,
      },
    },
    // {
    //   id: 'geounit-circles',
    //   type: 'heatmap',
    //   source: 'blockgroups',
    //   'source-layer': 'geounitlabels',
    //   layout: {
    //     visibility: 'none',
    //   },
    //   paint: {
    //     'heatmap-color': [
    //       'interpolate',
    //       ['linear'],
    //       ['heatmap-density'],
    //       0,
    //       'hsla(240, 100%, 50%, 0)',
    //       1,
    //       'hsla(195, 83%, 16%, 1)',
    //     ],
    //     'heatmap-opacity': 0.6,
    //     'heatmap-intensity': 0.5,
    //     'heatmap-radius': [
    //       'interpolate',
    //       ['linear'],
    //       ['zoom'],
    //       5,
    //       ['interpolate', ['linear'], ['get', 'black'], 0, 1, 5390, 10],
    //       11,
    //       ['interpolate', ['linear'], ['get', 'black'], 0, 5, 5390, 50],
    //     ],
    //   },
    // },
    // {
    //   id: 'county-circles',
    //   type: 'heatmap',
    //   source: 'blockgroups',
    //   'source-layer': 'countylabels',
    //   layout: {
    //     visibility: 'none',
    //   },
    //   paint: {
    //     'heatmap-color': [
    //       'interpolate',
    //       ['linear'],
    //       ['heatmap-density'],
    //       0,
    //       'hsla(240, 100%, 50%, 0)',
    //       1,
    //       'hsla(195, 83%, 16%, 1)',
    //     ],
    //     'heatmap-opacity': 0.6,
    //     'heatmap-intensity': 0.5,
    //     'heatmap-radius': [
    //       'interpolate',
    //       ['linear'],
    //       ['zoom'],
    //       5,
    //       ['interpolate', ['linear'], ['get', 'black'], 5000, 1, 530090, 50],
    //       11,
    //       ['interpolate', ['linear'], ['get', 'black'], 0, 5, 530090, 200],
    //     ],
    //   },
    // },
    {
      id: 'blockgroups-outline',
      type: 'line',
      source: 'blockgroups',
      'source-layer': tileLayerName,
      paint: {
        'line-color': '#000',
        'line-opacity': 0.1,
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
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
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
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
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
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
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
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
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
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
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
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
        'text-halo-width': {
          base: 1,
          stops: [[14, 1.25], [15, 1.5]],
        },
        'text-halo-blur': 0,
      },
    },
    {
      id: 'geounit-labels',
      type: 'symbol',
      minzoom: 9,
      source: 'blockgroups',
      'source-layer': 'geounitlabels',
      layout: {
        'text-size': 12,
        'symbol-spacing': 1,
        'text-padding': 10,
        'text-field': '{native}',
        'text-max-width': 7,
        'text-font': ['GR'],
        visibility: 'none',
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
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
      source: 'blockgroups',
      'source-layer': 'countylabels',
      layout: {
        'text-size': 14,
        'symbol-spacing': 1,
        'text-padding': 10,
        'text-field': '{population}',
        'text-max-width': 7,
        'text-font': ['GR'],
        visibility: 'none',
      },
      paint: {
        'text-color': '#000',
        'text-opacity': 0.9,
        'text-halo-color': '#fff',
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
