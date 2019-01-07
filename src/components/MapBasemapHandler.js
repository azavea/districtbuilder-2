import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addRasterLayer, removeRasterLayer } from '../constants';

class MapBasemapHandler extends Component {
  render() {
    const { map, mapBasemap } = this.props;
    if (map.getSource('raster-basemap')) {
      map.removeLayer('raster-basemap').removeSource('raster-basemap');
    }
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
      default:
        removeRasterLayer(map);
        break;
    }
    return <div className="map-label-handler" />;
  }
}

const mapStateToProps = state => {
  return {
    mapBasemap: state.mapBasemap,
  };
};

export default connect(mapStateToProps)(MapBasemapHandler);
