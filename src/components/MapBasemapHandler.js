import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addRasterLayer, removeRasterLayer } from '../constants';
import { getOpacityExpress } from '../util/map';
import { withMap } from './Context';

class MapBasemapHandler extends Component {
  componentDidUpdate() {
    const { map, mapBasemap, selectionLevel } = this.props;
    if (map.getSource('raster-basemap')) {
      map.removeLayer('raster-basemap').removeSource('raster-basemap');
    }
    removeRasterLayer(map);
    map.setLayoutProperty('geounits-choropleth', 'visibility', 'none');
    map.setLayoutProperty('county-choropleth', 'visibility', 'none');
    var activeLayer = selectionLevel === 'geounit' ? 'geounits-choropleth' : 'county-choropleth';
    switch (mapBasemap) {
      case 'satellite':
        addRasterLayer(
          map,
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        );
        break;
      case 'topography':
        addRasterLayer(
          map,
          'https://stamen-tiles-a.a.ssl.fastly.net/toposm-color-relief/{z}/{x}/{y}.jpg'
        );
        break;
      case 'streets':
        addRasterLayer(
          map,
          'https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png'
        );
        break;
      case 'total':
        map.setPaintProperty(activeLayer, 'fill-opacity', getOpacityExpress('popw'));
        map.setLayoutProperty(activeLayer, 'visibility', 'visible');
        break;
      case 'white':
        map.setPaintProperty(activeLayer, 'fill-opacity', getOpacityExpress('whitew'));
        map.setLayoutProperty(activeLayer, 'visibility', 'visible');
        break;
      case 'black':
        map.setPaintProperty(activeLayer, 'fill-opacity', getOpacityExpress('blackw'));
        map.setLayoutProperty(activeLayer, 'visibility', 'visible');
        break;
      case 'asian':
        map.setPaintProperty(activeLayer, 'fill-opacity', getOpacityExpress('asianw'));
        map.setLayoutProperty(activeLayer, 'visibility', 'visible');
        break;
      case 'hispanic':
        map.setPaintProperty(activeLayer, 'fill-opacity', getOpacityExpress('hispanicw'));
        map.setLayoutProperty(activeLayer, 'visibility', 'visible');
        break;
      case 'other':
        map.setPaintProperty(activeLayer, 'fill-opacity', getOpacityExpress('otherw'));
        map.setLayoutProperty(activeLayer, 'visibility', 'visible');
        break;
      default:
        break;
    }
  }
  componentDidMount() {
    this.forceUpdate();
  }
  render() {
    return <div className="map-label-handler" />;
  }
}

const mapStateToProps = state => {
  return {
    mapBasemap: state.mapBasemap,
    selectionLevel: state.selectionLevel,
  };
};

export default withMap(connect(mapStateToProps)(MapBasemapHandler));
