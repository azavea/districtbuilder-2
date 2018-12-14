import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapCircleHandler extends Component {
  componentWillMount() {}
  render() {
    if (this.props.mapChoropleth !== 'off' && this.props.selectionLevel === 'geounit') {
      this.props.map.setLayoutProperty('geounit-circles', 'visibility', 'visible');
      this.props.map.setPaintProperty('geounit-circles', 'circle-radius', [
        'interpolate',
        ['exponential', 1],
        ['get', this.props.mapChoropleth],
        0,
        0,
        5390,
        12,
      ]);
    } else {
      this.props.map.setLayoutProperty('geounit-circles', 'visibility', 'none');
    }
    if (this.props.mapChoropleth !== 'off' && this.props.selectionLevel === 'county') {
      this.props.map.setLayoutProperty('county-circles', 'visibility', 'visible');
      this.props.map.setPaintProperty('county-circles', 'circle-radius', [
        'interpolate',
        ['exponential', 1],
        ['get', this.props.mapChoropleth],
        0,
        0,
        1500000,
        20,
      ]);
    } else {
      this.props.map.setLayoutProperty('county-circles', 'visibility', 'none');
    }
    return <div className="map-layer-handler" />;
  }
}

const mapStateToProps = state => {
  return {
    mapChoropleth: state.mapChoropleth,
    selectionLevel: state.selectionLevel,
  };
};

export default connect(mapStateToProps)(MapCircleHandler);
