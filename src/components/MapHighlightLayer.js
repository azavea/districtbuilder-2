import React, { Component } from 'react';
import { connect } from 'react-redux';
import geobuf from 'geobuf';
import Pbf from 'pbf';

class MapHighlightLayer extends Component {
  componentWillMount() {
    window.updateHighlightWorker.addEventListener('message', m => {
      switch (m.data.type) {
        case 'HIGHLIGHT':
          this.geo = geobuf.decode(new Pbf(m.data.results));
          this.props.map.getSource('highlight').setData(this.geo);
          break;
        default:
          break;
      }
      m = null;
    });
  }
  render() {
    const { selectedIds, activatedIds } = this.props;

    if (selectedIds) {
      window.updateHighlightWorker.postMessage({
        type: 'HIGHLIGHT',
        selectedIds,
        activatedIds,
      });
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
