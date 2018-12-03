import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import memoize from 'memoizee';
import './mapbox-gl.css';

import { updateHighlight } from '../util';

mapboxgl.accessToken = 'pk.eyJ1IjoibGtuYXJmIiwiYSI6IjhjbGg4RUkifQ.-lS6mAkmR3SVh-W4XwQElg';

class MapHighlightLayer extends Component {
  updateHighlightMemoized = memoize(updateHighlight, {
    max: 1,
    limit: 1,
    primitive: true,
  });

  render() {
    if (this.props.topoJSON && this.props.selectedIds) {
      this.updateHighlightMemoized(this.props.selectedIds, this.props.topoJSON, this.props.map);
    }

    return <div className="map-highlight-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    selectedIds: state.selectedIds,
    topoJSON: state.topoJSON,
  };
};

export default connect(mapStateToProps)(MapHighlightLayer);
