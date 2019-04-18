import React, { Component } from 'react';
import { connect } from 'react-redux';
import geobuf from 'geobuf';
import Pbf from 'pbf';

import { withMap } from './Context';
import { districtColors } from '../constants';

class MapSelectedLayer extends Component {
  componentDidMount() {
    window.spatialWorker.addEventListener('message', m => {
      switch (m.data.type) {
        case 'HIGHLIGHT':
          this.geo = geobuf.decode(new Pbf(m.data.results));
          this.props.map.getSource('highlight').setData(this.geo);
          break;
        default:
          break;
      }
      m = null;
    });
  }
  componentDidUpdate() {
    const { selectedIds } = this.props;
    if (selectedIds) {
      window.spatialWorker.postMessage({
        type: 'HIGHLIGHT',
        selectedIds,
      });
    }
  }
  render() {
    return <div className="map-highlight-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    selectedIds: state.historyState.present.selectedIds,
  };
};

export default withMap(connect(mapStateToProps)(MapSelectedLayer));
