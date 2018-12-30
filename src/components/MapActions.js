import React, { Component } from 'react';
import { connect } from 'react-redux';

import { OptionButtons } from './OptionButtons';
import { OptionSelect } from './OptionSelect';
import { OptionToggle } from './OptionToggle';

import {
  changeOptionDrawMode,
  changeOptionMapChoropleth,
  changeOptionMapNumber,
  changeOptionSelectionLevel,
  changeOptionDrawLimit,
  changeOptionSidebarRace,
  changeOptionSidebarPolitics,
} from '../actions';

import {
  optionsDrawMode,
  optionsSelectionLevel,
  optionsMapChoropleth,
  optionsMapNumber,
  optionsDrawLimit,
} from '../constants/options';

class MapActions extends Component {
  onDownload = () => {
    window.updateHighlightWorker.postMessage({
      type: 'DOWNLOAD_GEOJSON',
      assignedDistricts: this.props.districts,
    });
  };

  render() {
    return (
      <div className="map-actions">
        <OptionButtons
          action={this.props.onChangeOptionDrawMode}
          options={optionsDrawMode}
          selectedOption={this.props.drawMode}
        />
        <OptionButtons
          action={this.props.onChangeOptionSelectionLevel}
          options={optionsSelectionLevel}
          selectedOption={this.props.selectionLevel}
        />
        <OptionSelect
          action={this.props.onChangeOptionMapChoropleth}
          options={optionsMapChoropleth}
          selectedOption={this.props.mapChoropleth}
        />
        <OptionSelect
          action={this.props.onChangeOptionMapNumber}
          options={optionsMapNumber}
          selectedOption={this.props.mapNumber}
        />
        <OptionToggle
          action={this.props.onChangeOptionDrawLimit}
          options={optionsDrawLimit}
          selectedOption={this.props.drawLimit}
        />
        <button onClick={() => this.onDownload()}>
          <i className="icon-download" />
        </button>
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
    districts: state.districts,
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
