import React, { Component } from 'react';
import { connect } from 'react-redux';
import memoize from 'memoizee';

import { updateHighlight } from '../util';

class MapHighlightLayer extends Component {
  updateHighlightMemoized = memoize(updateHighlight, {
    max: 1,
    length: 3,
    primitive: true,
  });

  render() {
    if (this.props.topoJSON && this.props.selectedIds) {
      this.updateHighlightMemoized(
        this.props.selectedIds,
        this.props.activatedIds,
        this.props.lockedDistricts,
        this.props.topoJSON,
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
    topoJSON: state.topoJSON,
    lockedDistricts: state.lockedDistricts,
  };
};

export default connect(mapStateToProps)(MapHighlightLayer);
