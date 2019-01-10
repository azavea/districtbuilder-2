import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeOptionDrawMode } from '../actions';

class MapActions extends Component {
  renderDrawButtons() {
    const drawModes = ['Pointer', 'Rectangle', 'Line'];
    return drawModes.map((mode, index) => {
      const status = mode === this.props.drawMode ? ' selected' : '';
      return (
        <button
          className={'map-action' + status}
          key={index}
          onClick={() => this.props.onChangeOptionDrawMode(mode)}
        >
          {mode}
        </button>
      );
    });
  }
  render() {
    return <div className="map-options" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    drawMode: state.drawMode,
  };
};

const mapActionsToProps = {
  onChangeOptionDrawMode: changeOptionDrawMode,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapActions);
