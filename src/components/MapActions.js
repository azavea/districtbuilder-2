import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Popup } from 'semantic-ui-react';

import { OptionButtons } from './OptionButtons';
import OptionsMenu from './OptionsMenu';

import {
  changeOptionDrawMode,
  changeOptionMapNumber,
  changeOptionSelectionLevel,
  changeOptionSidebarRace,
  changeOptionSidebarPolitics,
  changeOptionMapCountyName,
  changeOptionMapLabels,
  changeOptionMapBasemap,
} from '../actions';

import {
  optionsDrawMode,
  optionsSelectionLevel,
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
          <Popup
            trigger={
              <button>
                <i className="icon-cog" />
              </button>
            }
            content={<OptionsMenu />}
            on="click"
            position="bottom right"
          />
          <div className="header-divider" />
          <OptionButtons
            action={this.props.onChangeOptionSelectionLevel}
            options={optionsSelectionLevel}
            selectedOption={this.props.selectionLevel}
          />
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
    sidebarRace: state.sidebarRace,
    sidebarPolitics: state.sidebarPolitics,
    mapPopulationsLabels: state.mapPopulationsLabels,
    mapBasemap: state.mapBasemap,
    districts: state.historyState.present.districts,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeOptionDrawMode: option => dispatch(changeOptionDrawMode(option)),
    onChangeOptionMapNumber: option => dispatch(changeOptionMapNumber(option)),
    onChangeOptionSelectionLevel: option => dispatch(changeOptionSelectionLevel(option)),
    onChangeOptionSidebarRace: option => dispatch(changeOptionSidebarRace(option)),
    onChangeOptionSidebarPolitics: option => dispatch(changeOptionSidebarPolitics(option)),
    onChangeOptionMapCountyName: option => dispatch(changeOptionMapCountyName(option)),
    onChangeOptionMapLabels: option => dispatch(changeOptionMapLabels(option)),
    onChangeOptionMapBasemap: option => dispatch(changeOptionMapBasemap(option)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapActions);
