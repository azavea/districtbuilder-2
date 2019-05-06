import React, { Component } from 'react';
import { connect } from 'react-redux';
import geobuf from 'geobuf';
import Pbf from 'pbf';

import { OptionToggle } from './OptionToggle';
import { changeOptionDrawCountyLimit, changeOptionDrawUnassigned } from '../actions';

import { optionDrawCountyLimit, optionDrawUnassigned } from '../constants/options';

class OptionsMenu extends Component {
  componentDidMount() {}
  componentDidUpdate() {}
  render() {
    return (
      // changeOptionDrawCountyLimit
      // changeOptionDrawUnassigned
      <div className="options-menu">
        <OptionToggle
          action={this.props.onChangeOptionDrawCountyLimit}
          option={optionDrawCountyLimit}
          selectedOption={this.props.optionDrawCountyLimit}
        />
        <OptionToggle
          action={this.props.onChangeOptionDrawUnassigned}
          option={optionDrawUnassigned}
          selectedOption={this.props.optionDrawUnassigned}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    optionDrawCountyLimit: state.optionDrawCountyLimit,
    optionDrawUnassigned: state.optionDrawUnassigned,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeOptionDrawCountyLimit: option => dispatch(changeOptionDrawCountyLimit(option)),
    onChangeOptionDrawUnassigned: option => dispatch(changeOptionDrawUnassigned(option)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionsMenu);
