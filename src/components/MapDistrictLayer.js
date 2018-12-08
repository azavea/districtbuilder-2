import React, { Component } from 'react';
import { connect } from 'react-redux';
// import memoize from 'memoizee';

// import { updateDistricts } from '../util';
import { pointerSelect, updatedDistricts } from '../actions';
import { districtSourceName } from '../constants';

class MapDistrictLayer extends Component {
  // updateDistrictsMemoized = memoize(updateDistricts, {
  //   max: 2,
  //   length: 2,
  //   primitive: true,
  // });

  onUpdatedDistricts = collection => {
    this.props.onUpdatedDistricts(collection);
  };

  componentWillMount() {
    // this.onUpdateDistricts(a);
  }

  render() {
    if (this.props.assignedDistricts.geometry) {
      this.props.map
        .getSource(districtSourceName)
        .setData(this.props.assignedDistricts.geometry.mergedGeoJSON);
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

// this.onUpdatedDistricts = this.props.onUpdatedDistricts.bind(this, true);

const mapActionsToProps = {
  onPointerSelect: pointerSelect,
  onUpdatedDistricts: updatedDistricts,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapDistrictLayer);
