import React, { Component } from 'react';
import { connect } from 'react-redux';

import { pointerSelect, updatedDistricts } from '../actions';

class MapDistrictLayer extends Component {
  onUpdatedDistricts = collection => {
    this.props.onUpdatedDistricts(collection);
  };

  render() {
    if (this.props.districts.geometry) {
      console.log(this.props.districts.geometry.mergedGeoJSON);
      this.props.map.getSource('districts').setData(this.props.districts.geometry.mergedGeoJSON);
    }
    return <div className="map-district-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    topoJSON: state.topoJSON,
    geometries: state.geometries,
    districts: state.districts,
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
