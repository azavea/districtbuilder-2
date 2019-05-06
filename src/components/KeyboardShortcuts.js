import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';
import { toast } from 'react-toastify';

import { keymap } from '../util/keyboard';
import { booleanToOnOff } from '../util/data';

import {
  undo,
  redo,
  changeOptionDrawMode,
  changeOptionSelectionLevel,
  acceptChanges,
  rejectChanges,
  selectDistrict,
  changeOptionDrawCountyLimit,
  changeOptionDrawUnassigned,
} from '../actions';

import { districtNum } from '../constants';
import { optionsSelectionLevel } from '../constants/options';

class KeyboardShortcuts extends Component {
  componentDidMount() {
    Mousetrap.bind(
      [
        keymap.pointer.key,
        keymap.rectangle.key,
        keymap.paintbrush.key,
        keymap.previousDistrict.key,
        keymap.nextDistrict.key,
        keymap.accept.key,
        keymap.reject.key,
        keymap.counties.key,
        keymap.geounit.key,
        keymap.toggleDrawCounty.key,
        keymap.toggleDrawUnassigned.key,
        keymap.undo.key,
        keymap.undo.alt,
        keymap.redo.key,
        keymap.redo.alt,
      ],
      (event, key) => {
        switch (key) {
          case keymap.pointer.key:
            this.props.onChangeOptionDrawMode('pointer');
            break;
          case keymap.rectangle.key:
            this.props.onChangeOptionDrawMode('rectangle');
            break;
          case keymap.paintbrush.key:
            this.props.onChangeOptionDrawMode('paintbrush');
            break;
          case keymap.previousDistrict.key:
            this.props.selectedDistrict > 0 &&
              this.props.onSelectDistrict(this.props.selectedDistrict - 1);
            break;
          case keymap.nextDistrict.key:
            this.props.selectedDistrict < districtNum &&
              this.props.onSelectDistrict(this.props.selectedDistrict + 1);
            break;

          case keymap.toggleDrawCounty.key:
            this.props.onChangeOptionDrawCountyLimit(!this.props.optionDrawCountyLimit);
            toast(
              `${booleanToOnOff(this.props.optionDrawCountyLimit)}: ${
                keymap.toggleDrawCounty.description
              }`
            );
            break;
          case keymap.toggleDrawUnassigned.key:
            this.props.onChangeOptionDrawUnassigned(!this.props.optionDrawUnassigned);
            toast(
              `${booleanToOnOff(this.props.optionDrawUnassigned)}: ${
                keymap.toggleDrawUnassigned.description
              }`
            );
            break;

          case keymap.accept.key:
            this.props.onAcceptChanges();
            break;
          case keymap.reject.key:
            this.props.onRejectChanges();
            break;
          case keymap.counties.key:
            this.props.onChangeOptionSelectionLevel(optionsSelectionLevel[0].value);
            break;
          case keymap.geounit.key:
            this.props.onChangeOptionSelectionLevel(optionsSelectionLevel[1].value);
            break;
          case keymap.undo.key:
          case keymap.undo.alt:
            this.props.onUndo();
            break;
          case keymap.redo.key:
          case keymap.redo.alt:
            this.props.onRedo();
            break;
          default:
            break;
        }
        event.preventDefault();
        return false;
      }
    );
  }
  render() {
    return <div />;
  }
}

const mapStateToProps = state => {
  return {
    selectedDistrict: state.historyState.present.selectedDistrict,
    selectionLevel: state.selectionLevel,
    optionDrawCountyLimit: state.optionDrawCountyLimit,
    optionDrawUnassigned: state.optionDrawUnassigned,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeOptionSelectionLevel: option => dispatch(changeOptionSelectionLevel(option)),
    onChangeOptionDrawMode: option => dispatch(changeOptionDrawMode(option)),
    onSelectDistrict: districtId => dispatch(selectDistrict(districtId)),
    onChangeOptionDrawCountyLimit: option => dispatch(changeOptionDrawCountyLimit(option)),
    onChangeOptionDrawUnassigned: option => dispatch(changeOptionDrawUnassigned(option)),
    onAcceptChanges: () => dispatch(acceptChanges()),
    onRejectChanges: () => dispatch(rejectChanges()),
    onUndo: () => dispatch(undo()),
    onRedo: () => dispatch(redo()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyboardShortcuts);
