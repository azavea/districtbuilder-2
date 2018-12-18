import React, { Component } from 'react';
import { connect } from 'react-redux';
// import memoize from 'memoizee';

import { updateHighlight } from '../util';

class MapHighlightLayer extends Component {
  render() {
    console.log('Running map highlight layer');

    if (window.dataTopoJSON && this.props.selectedIds) {
      updateHighlight(
        this.props.selectedIds,
        this.props.activatedIds,
        this.props.lockedDistricts,
        this.props.map
      );
    }

    return <div className="map-highlight-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    selectedIds: state.selectedIds,
    activatedIds: state.activatedIds,
    lockedDistricts: state.lockedDistricts,
  };
};

export default connect(mapStateToProps)(MapHighlightLayer);
