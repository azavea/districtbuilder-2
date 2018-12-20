import React, { Component } from 'react';
import { connect } from 'react-redux';
// import MyWorker from 'worker-loader!../workers/worker.js'; // eslint-disable-line import/no-webpack-loader-syntax

import { updateHighlight } from '../util';
import MyWorker from 'worker-loader!../workers/worker.js'; // eslint-disable-line import/no-webpack-loader-syntax

class MapHighlightLayer extends Component {
  componentWillMount() {
    this.worker = new MyWorker();
  }
  render() {
    const { selectedIds, activatedIds, lockedDistricts, map } = this.props;

    if (window.dataTopoJSON && this.props.selectedIds) {
      this.worker.postMessage({
        selectedIds,
        activatedIds,
        topoJSON: JSON.parse(window.dataTopoJSON),
      });
    }

    this.worker.onmessage = m => {
      map.getSource('highlight').setData(m.data);
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
