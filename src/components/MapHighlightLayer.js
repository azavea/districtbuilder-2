import React, { Component } from 'react';
import { connect } from 'react-redux';
// import MyWorker from 'worker-loader!../workers/worker.js'; // eslint-disable-line import/no-webpack-loader-syntax

import { updateHighlight } from '../util';
let MyWorker = require('worker-loader!../workers/worker.js'); // eslint-disable-line import/no-webpack-loader-syntax

class MapHighlightLayer extends Component {
  componentWillMount() {
    this.worker = new MyWorker();
  }
  render() {
    console.log('Running map highlight layer');

    this.worker.onmessage = m => this.setState({ data: m.data });
    let data;
    if (this.state) {
      data = this.state.data;
    }

    return (
      <div className="map-highlight-layer">
        A: {data}
        <button onClick={() => this.worker.postMessage(null)}> Up </button>
      </div>
    );
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
