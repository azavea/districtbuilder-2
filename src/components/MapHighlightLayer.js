import React, { Component } from 'react';
import { connect } from 'react-redux';
import geobuf from 'geobuf';
import Pbf from 'pbf';

import { withMap } from './Context';

class MapHighlightLayer extends Component {
  drawHighlight = () => {
    const { selectedIds, activatedIds } = this.props;
    if (selectedIds) {
      window.spatialWorker.postMessage({
        type: 'HIGHLIGHT',
        selectedIds,
        activatedIds,
      });
    }
  };
  componentDidMount() {
    window.spatialWorker.addEventListener('message', m => {
      switch (m.data.type) {
        case 'HIGHLIGHT':
          this.geo = geobuf.decode(new Pbf(m.data.results));
          if (typeof this.geo.coordinates !== 'undefined') {
            this.props.map.getSource('highlight').setData(this.geo);
          } else {
            this.props.map
              .getSource('highlight')
              .setData({ type: 'Feature', properties: { title: 'empty' }, geometry: null });
          }
          break;
        default:
          break;
      }
      m = null;
    });
    this.drawHighlight();
  }
  componentDidUpdate() {
    this.drawHighlight();
  }
  render() {
    return <div className="map-highlight-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    selectedIds: state.historyState.present.selectedIds,
    activatedIds: state.activatedIds,
    lockedDistricts: state.lockedDistricts,
  };
};

export default withMap(connect(mapStateToProps)(MapHighlightLayer));
