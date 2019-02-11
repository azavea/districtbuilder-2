import React, { Component } from 'react';
import { connect } from 'react-redux';

import { undo, redo } from '../actions';

class MapUndoHandler extends Component {
  onDownload = () => {
    window.spatialWorker.postMessage({
      type: 'DOWNLOAD_GEOJSON',
      assignedDistricts: this.props.districts,
    });
  };

  render() {
    const { canUndo, canRedo } = this.props;
    return (
      <div className="undo-redo-buttons">
        <button data-rh="Undo" onClick={() => this.props.onUndo()} disabled={!canUndo}>
          <i className="icon-undo" />
        </button>
        <button data-rh="Redo" onClick={() => this.props.onRedo()} disabled={!canRedo}>
          <i className="icon-redo" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    canUndo: state.historyState.past.length > 0,
    canRedo: state.historyState.future.length > 0,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUndo: () => dispatch(undo()),
    onRedo: () => dispatch(redo()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapUndoHandler);
