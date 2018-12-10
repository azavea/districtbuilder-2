import React, { Component } from 'react';
import { connect } from 'react-redux';

import { OptionButtons } from './OptionButtons';
import { OptionSelect } from './OptionSelect';
import { changeOptionDrawMode } from '../actions';

class MapActions extends Component {
  render() {
    return (
      <div className="map-actions">
        <OptionButtons
          action={this.props.onChangeOptionDrawMode}
          options={['Pointer', 'Rectangle', 'Line']}
          selectedOption={this.props.drawMode}
        />
        <OptionSelect
          action={this.props.onChangeOptionDrawMode}
          options={['Off', 'Population', 'White', 'Black']}
          selectedOption={this.props.drawMode}
        />
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
  onChangeOptionDrawMode: changeOptionDrawMode,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapActions);
