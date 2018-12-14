import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapLayerHandler extends Component {
  render() {
    console.log('What is the selection level?', this.props.selectionLevel);
    if (this.props.selectionLevel === 'county') {
      this.props.map.setLayoutProperty('blockgroups-outline', 'visibility', 'none');
    }
    if (this.props.selectionLevel === 'geounit') {
      this.props.map.setLayoutProperty('blockgroups-outline', 'visibility', 'visible');
    }
    return <div className="map-layer-handler" />;
  }
}

const mapStateToProps = state => {
  return {
    selectionLevel: state.selectionLevel,
  };
};

export default connect(mapStateToProps)(MapLayerHandler);
