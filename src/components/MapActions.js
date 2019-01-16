import React, { Component } from 'react';
import { connect } from 'react-redux';

import { OptionButtons } from './OptionButtons';
import { OptionToggle } from './OptionToggle';
import { Dropdown } from 'semantic-ui-react';
import '../css/dropdown.css';

import {
  changeOptionDrawMode,
  changeOptionMapNumber,
  changeOptionSelectionLevel,
  changeOptionDrawLimit,
  changeOptionSidebarRace,
  changeOptionSidebarPolitics,
  changeOptionMapCountyName,
  changeOptionMapLabels,
  changeOptionMapBasemap,
  undo,
  redo,
} from '../actions';

import {
  optionsDrawMode,
  optionsSelectionLevel,
  optionsDrawLimit,
  optionsMapLabels,
  optionsMapBasemap,
} from '../constants/options';

class MapActions extends Component {
  render() {
    const trigger = (label, options, value) => {
      const text = options.find(element => {
        return element.value === value;
      }).text;
      return (
        <span>
          {label}: <b>{text}</b>
        </span>
      );
    };
    return (
      <div className="map-actions">
        <div className="actions-left">
          <OptionButtons
            action={this.props.onChangeOptionDrawMode}
            options={optionsDrawMode}
            selectedOption={this.props.drawMode}
          />
          <div className="header-divider" />
          <OptionButtons
            action={this.props.onChangeOptionSelectionLevel}
            options={optionsSelectionLevel}
            selectedOption={this.props.selectionLevel}
          />
          {false && (
            <OptionToggle
              action={this.props.onChangeOptionDrawLimit}
              options={optionsDrawLimit}
              selectedOption={this.props.drawLimit}
            />
          )}
        </div>
        <div className="actions-right">
          <Dropdown
            inline
            trigger={trigger('Labels', optionsMapLabels, this.props.mapLabels)}
            options={optionsMapLabels}
            defaultValue={this.props.mapLabels}
            onChange={(e, data) => {
              this.props.onChangeOptionMapLabels(data.value);
            }}
          />
          <Dropdown
            inline
            trigger={trigger('Basemap', optionsMapBasemap, this.props.mapBasemap)}
            options={optionsMapBasemap}
            defaultValue={this.props.mapBasemap}
            direction="right"
            onChange={(e, data) => {
              this.props.onChangeOptionMapBasemap(data.value);
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    drawMode: state.drawMode,
    mapNumber: state.mapNumber,
    mapLabels: state.mapLabels,
    selectionLevel: state.selectionLevel,
    mapCountyName: state.mapCountyName,
    drawLimit: state.drawLimit,
    sidebarRace: state.sidebarRace,
    sidebarPolitics: state.sidebarPolitics,
    mapPopulationsLabels: state.mapPopulationsLabels,
    mapBasemap: state.mapBasemap,
    districts: state.historyState.present.districts,
  };
};

const mapActionsToProps = {
  onChangeOptionDrawMode: changeOptionDrawMode,
  onChangeOptionMapNumber: changeOptionMapNumber,
  onChangeOptionSelectionLevel: changeOptionSelectionLevel,
  onChangeOptionDrawLimit: changeOptionDrawLimit,
  onChangeOptionSidebarRace: changeOptionSidebarRace,
  onChangeOptionSidebarPolitics: changeOptionSidebarPolitics,
  onChangeOptionMapCountyName: changeOptionMapCountyName,
  onChangeOptionMapLabels: changeOptionMapLabels,
  onChangeOptionMapBasemap: changeOptionMapBasemap,
  onUndo: undo,
  onRedo: redo,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapActions);
