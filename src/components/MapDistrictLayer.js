import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { updateDistricts } from '../util';
import { clickGeounit } from '../actions';

mapboxgl.accessToken = 'pk.eyJ1IjoibGtuYXJmIiwiYSI6IjhjbGg4RUkifQ.-lS6mAkmR3SVh-W4XwQElg';

class MapDistrictLayer extends Component {
  updateDistrictsMemomized = memoize(updateDistricts, {
    max: 2,
    limit: 1,
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
  onClickGeounit: clickGeounit,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapDistrictLayer);
