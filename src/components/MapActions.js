import React, { Component } from 'react';
import { connect } from 'react-redux';

import { OptionButtons } from './OptionButtons';
import { OptionSelect } from './OptionSelect';
import {
  changeOptionDrawMode,
  changeOptionMapChoropleth,
  changeOptionMapNumber,
  changeOptionSelectionLevel,
  changeOptionDrawLimit,
  changeOptionSidebarRace,
  changeOptionSidebarPolitics,
} from '../actions';

class MapActions extends Component {
  render() {
    return (
      <div className="map-actions">
        <OptionButtons
          action={this.props.onChangeOptionDrawMode}
          options={['Pointer', 'Rectangle', 'Line']}
          selectedOption={this.props.drawMode}
        />
        {/*        <OptionButtons
          action={this.props.onChangeOptionSelectionLevel}
          options={['County', 'Block Group']}
          selectedOption={this.props.selectionLevel}
        />
        <OptionSelect
          action={this.props.onChangeOptionMapChoropleth}
          options={['Off', 'Population', 'White', 'Black']}
          selectedOption={this.props.mapChoropleth}
        />
        <OptionSelect
          action={this.props.onChangeOptionMapNumber}
          options={['Off', 'Population', 'White', 'Black']}
          selectedOption={this.props.mapNumber}
        />*/}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    drawMode: state.drawMode,
    mapChoropleth: state.mapChoropleth,
    mapNumber: state.mapNumber,
    selectionLevel: state.selectionLevel,
    drawLimit: state.drawLimit,
    sidebarRace: state.sidebarRace,
    sidebarPolitics: state.sidebarPolitics,
  };
};

const mapActionsToProps = {
  onChangeOptionDrawMode: changeOptionDrawMode,
  onChangeOptionMapChoropleth: changeOptionMapChoropleth,
  onChangeOptionMapNumber: changeOptionMapNumber,
  onChangeOptionSelectionLevel: changeOptionSelectionLevel,
  onChangeOptionDrawLimit: changeOptionDrawLimit,
  onChangeOptionSidebarRace: changeOptionSidebarRace,
  onChangeOptionSidebarPolitics: changeOptionSidebarPolitics,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapActions);
