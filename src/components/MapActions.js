import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clickDrawMode } from '../actions';

class MapActions extends Component {
  componentDidMount() {}
  renderDrawButtons() {
    const drawModes = ['Pointer', 'Rectangle', 'Line'];
    return drawModes.map((mode, index) => {
      const status = mode === this.props.drawMode ? ' selected' : '';
      return (
        <button
          className={'map-action' + status}
          key={index}
          onClick={() => this.props.onClickDrawMode(mode)}
        >
          {mode}
        </button>
      );
    });
  }
  render() {
    return (
      <div className="map-actions">
        <div>{this.renderDrawButtons()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    drawMode: state.drawMode,
  };
};

const mapActionsToProps = {
  onClickDrawMode: clickDrawMode,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapActions);
