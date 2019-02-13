import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapOptionsMenu extends Component {
  componentDidMount() {}

  render() {
    return (
      <button data-rh="Open options menu" onClick={() => {}}>
        <i className="icon-cog-solid" />
      </button>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // onChangeOptionDrawMode: option => dispatch(changeOptionDrawMode(option)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(MapOptionsMenu);
