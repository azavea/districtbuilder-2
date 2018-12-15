import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapLabelHandler extends Component {
  componentWillMount() {}
  render() {
    if (this.props.mapNumber !== 'off' && this.props.selectionLevel === 'geounit') {
      this.props.map.setLayoutProperty('geounit-labels', 'visibility', 'visible');
      this.props.map.setLayoutProperty(
        'geounit-labels',
        'text-field',
        `{${this.props.mapNumber}abbr}`
      );
    } else {
      this.props.map.setLayoutProperty('geounit-labels', 'visibility', 'none');
    }
    if (this.props.mapNumber !== 'off' && this.props.selectionLevel === 'county') {
      this.props.map.setLayoutProperty('county-labels', 'visibility', 'visible');
      this.props.map.setLayoutProperty(
        'county-labels',
        'text-field',
        `{${this.props.mapNumber}abbr}`
      );
    } else {
      this.props.map.setLayoutProperty('county-labels', 'visibility', 'none');
    }
    return <div className="map-layer-handler" />;
  }
}

const mapStateToProps = state => {
  return {
    mapNumber: state.mapNumber,
    selectionLevel: state.selectionLevel,
  };
};

export default connect(mapStateToProps)(MapLabelHandler);
