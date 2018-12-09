import React, { Component } from 'react';
import { connect } from 'react-redux';

import { pointerSelect, updatedDistricts } from '../actions';
import { districtSourceName } from '../constants';

class MapDistrictLayer extends Component {
  onUpdatedDistricts = collection => {
    this.props.onUpdatedDistricts(collection);
  };

  render() {
    if (this.props.districts.geometry) {
      this.props.map
        .getSource(districtSourceName)
        .setData(this.props.districts.geometry.mergedGeoJSON);
    }
    return <div className="map-district-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    topoJSON: state.topoJSON,
    geometries: state.geometries,
    districts: state.districts,
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
