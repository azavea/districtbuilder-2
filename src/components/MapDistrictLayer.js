import React, { Component } from 'react';
import { connect } from 'react-redux';
import geobuf from 'geobuf';
import Pbf from 'pbf';

import { updateGeometry } from '../actions';
import { withMap } from './Context';

class MapDistrictLayer extends Component {
  onUpdatedDistricts = collection => {
    this.props.onUpdatedDistricts(collection);
  };

  componentDidMount() {
    window.spatialWorker.addEventListener('message', m => {
      switch (m.data.type) {
        case 'DISTRICTS':
          this.props.map
            .getSource('districts')
            .setData(geobuf.decode(new Pbf(m.data.mergedGeoJSON)));
          this.props.onUpdateGeometry(m.data.districtCompactnessScores);
          break;
        default:
          break;
      }
      m = null;
    });
    this.forceUpdate();
  }

  componentDidUpdate() {
    if (this.props.districts) {
      window.spatialWorker.postMessage({
        type: 'DISTRICTS',
        assignedDistricts: this.props.districts,
        lockedDistricts: this.props.lockedDistricts,
      });
    }
  }

  render() {
    return <div className="map-district-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    districts: state.historyState.present.districts,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateGeometry: compactnessScores => dispatch(updateGeometry(compactnessScores)),
  };
};

export default withMap(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MapDistrictLayer)
);
