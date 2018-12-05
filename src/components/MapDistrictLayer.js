import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { updateDistricts } from '../util';
import { pointerSelect } from '../actions';

class MapDistrictLayer extends Component {
  updateDistrictsMemomized = memoize(updateDistricts, {
    max: 2,
    length: 1,
    primitive: true,
  });

  render() {
    if (this.props.topoJSON && this.props.assignedDistricts) {
      this.updateDistrictsMemomized(
        this.props.assignedDistricts,
        this.props.topoJSON,
        this.props.map
      );
    }
    return <div className="map-district-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    topoJSON: state.topoJSON,
    geometries: state.geometries,
    assignedDistricts: state.assignedDistricts,
  };
};

const mapActionsToProps = {
  onPointerSelect: pointerSelect,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapDistrictLayer);
