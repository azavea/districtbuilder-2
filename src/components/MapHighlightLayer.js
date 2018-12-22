import React, { Component } from 'react';
import { connect } from 'react-redux';

import updateHighlightWorker from 'worker-loader!../workers/update-highlight-worker.js'; // eslint-disable-line import/no-webpack-loader-syntax

class MapHighlightLayer extends Component {
  componentWillMount() {
    this.worker = new updateHighlightWorker();
  }
  render() {
    const { selectedIds, activatedIds, map } = this.props;

    if (window.dataTopoJSON && this.props.selectedIds) {
      this.worker.postMessage({
        selectedIds,
        activatedIds,
        topoJSON: window.dataTopoJSON,
      });
    }

    this.worker.onmessage = m => {
      map.getSource('highlight').setData(m.data);
      m = null;
    };

    return <div className="map-highlight-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    selectedIds: state.selectedIds,
    activatedIds: state.activatedIds,
    lockedDistricts: state.lockedDistricts,
  };
};

export default connect(mapStateToProps)(MapHighlightLayer);
