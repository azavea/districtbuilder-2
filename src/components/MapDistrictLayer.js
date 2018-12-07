import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { updateDistricts } from '../util';
import { pointerSelect, updatedDistricts } from '../actions';

class MapDistrictLayer extends Component {
  updateDistrictsMemoized = memoize(updateDistricts, {
    max: 2,
    length: 2,
    primitive: true,
  });

  render() {
    if (this.props.topoJSON && this.props.assignedDistricts) {
      this.updateDistrictsMemoized(
        this.props.assignedDistricts,
        this.props.lockedDistricts,
        this.props.topoJSON,
        this.props.map,
        this.props.onUpdatedDistricts
      );
      console.timeEnd('mergeTopoAndCalculateCompactness');
    }
    return <div className="map-district-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    topoJSON: state.topoJSON,
    geometries: state.geometries,
    assignedDistricts: state.assignedDistricts,
    lockedDistricts: state.lockedDistricts,
  };
};

const mapActionsToProps = {
  onPointerSelect: pointerSelect,
  onUpdatedDistricts: updatedDistricts,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapDistrictLayer);