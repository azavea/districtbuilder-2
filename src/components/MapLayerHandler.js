import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withMap } from './Context';

class MapLayerHandler extends Component {
  componentDidUpdate() {
    if (this.props.selectionLevel === 'county') {
      this.props.map.setLayoutProperty('blockgroups-outline', 'visibility', 'none');
    }
    if (this.props.selectionLevel === 'geounit') {
      this.props.map.setLayoutProperty('blockgroups-outline', 'visibility', 'visible');
    }
  }
  render() {
    return <div className="map-layer-handler" />;
  }
}

const mapStateToProps = state => {
  return {
    selectionLevel: state.selectionLevel,
  };
};

export default withMap(connect(mapStateToProps)(MapLayerHandler));
