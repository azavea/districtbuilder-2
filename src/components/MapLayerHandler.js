import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapLayerHandler extends Component {
  componentWillMount() {}
  render() {
    if (this.props.selectionLevel === 'county') {
      this.props.map.setLayoutProperty('blockgroups-outline', 'visibility', 'none');
    }
    if (this.props.selectionLevel === 'blockgroup') {
      this.props.map.setLayoutProperty('blockgroups-outline', 'visibility', 'visible');
    }
    return <div className="map-layer-handler" />;
  }
}

const mapActionsToProps = {
  // onPointerSelect: pointerSelect,
  // onRectangleStart: rectangleStart,
};

const mapStateToProps = state => {
  return {
    selectionLevel: state.selectionLevel,
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapLayerHandler);
