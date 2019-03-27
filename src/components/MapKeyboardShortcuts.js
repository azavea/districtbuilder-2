import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';

import {
  undo,
  redo,
  changeOptionDrawMode,
  changeOptionSelectionLevel,
  acceptChanges,
  rejectChanges,
  selectDistrict,
} from '../actions';
import { districtNum } from '../constants';
import { optionsSelectionLevel } from '../constants/options';

class MapKeyboardShortcuts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: 'Hello, I am a component that listens to keydown and keyup of a',
    };
  }
  componentDidMount() {
    Mousetrap.bind(
      [
        '1',
        '2',
        'q',
        'w',
        's',
        'a',
        'd',
        'e',
        'command+z',
        'ctrl+z',
        'shift+command+z',
        'shift+ctrl+z',
      ],
      (event, key) => {
        console.log(key);
        switch (key) {
          case '1':
            this.props.onChangeOptionDrawMode('pointer');
            break;
          case '2':
            this.props.onChangeOptionDrawMode('rectangle');
            break;
          case 'w':
            if (this.props.selectedDistrict > 0) {
              this.props.onSelectDistrict(this.props.selectedDistrict - 1);
            }
            break;
          case 's':
            if (this.props.selectedDistrict < districtNum) {
              this.props.onSelectDistrict(this.props.selectedDistrict + 1);
            }
            break;
          case 'e':
            this.props.onAcceptChanges();
            break;
          case 'q':
            this.props.onRejectChanges();
            break;
          case 'a':
            this.props.onChangeOptionSelectionLevel(optionsSelectionLevel[0].value);
            break;
          case 'd':
            this.props.onChangeOptionSelectionLevel(optionsSelectionLevel[1].value);
            break;
          case 'command+z':
          case 'ctrl+z':
            this.props.onUndo();
            break;
          case 'shift+command+z':
          case 'shift+ctrl+z':
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeOptionSelectionLevel: option => dispatch(changeOptionSelectionLevel(option)),
    onChangeOptionDrawMode: option => dispatch(changeOptionDrawMode(option)),
    onSelectDistrict: districtId => dispatch(selectDistrict(districtId)),
    onAcceptChanges: () => dispatch(acceptChanges()),
    onRejectChanges: () => dispatch(rejectChanges()),
    onUndo: () => dispatch(undo()),
    onRedo: () => dispatch(redo()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapKeyboardShortcuts);
