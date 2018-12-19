import React, { Component } from 'react';
import { connect } from 'react-redux';
// import memoize from 'memoizee';

import { updateHighlight } from '../util';

class MapHighlightLayer extends Component {
  render() {
    const { selectedIds, activatedIds, lockedDistricts, map } = this.props;

    if (window.dataTopoJSON && this.props.selectedIds) {
      var hi = updateHighlight(selectedIds, activatedIds, lockedDistricts);
      map.getSource('highlight').setData(hi);
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
