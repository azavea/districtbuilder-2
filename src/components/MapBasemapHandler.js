import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapBasemapHandler extends Component {
  render() {
    const { map, mapBasemap } = this.props;
    const addRasterLayer = (map, url, lineOpacity, fillOpacity) => {
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
        .setPaintProperty('blockgroups-outline', 'line-opacity', lineOpacity)
        .setPaintProperty('districts-fill', 'fill-opacity', fillOpacity);
    };
    if (map.getSource('raster-basemap')) {
      map.removeLayer('raster-basemap').removeSource('raster-basemap');
    }
    switch (mapBasemap) {
      case 'satellite':
        addRasterLayer(
          map,
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          0.3,
          0.5
        );
        break;
      case 'topography':
        addRasterLayer(
          map,
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
          0.3,
          0.4
        );
        break;
      case 'streets':
        addRasterLayer(
          map,
          'https://a.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}@2x.png',
          0.3,
          0.4
        );
        break;
      default:
        map
          .setPaintProperty('blockgroups-outline', 'line-opacity', 0.1)
          .setPaintProperty('districts-fill', 'fill-opacity', 1);
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
