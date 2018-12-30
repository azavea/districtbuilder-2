import React, { Component } from 'react';
import { connect } from 'react-redux';
import geobuf from 'geobuf';
import Pbf from 'pbf';
import FileSaver from 'file-saver';

class MapActions extends Component {
  componentWillMount() {
    window.updateHighlightWorker.addEventListener('message', m => {
      switch (m.data.type) {
        case 'DOWNLOAD_GEOJSON':
          console.log('Download launch');
          FileSaver.saveAs(
            new Blob([JSON.stringify(geobuf.decode(new Pbf(m.data.mergedGeoJSON)))], {
              type: 'text/json;charset=utf-8',
            }),
            'districts.geojson'
          );
          break;
        default:
          break;
      }
      m = null;
    });
  }

  render() {
    return <div className="map-download" />;
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

export default connect(mapStateToProps)(MapActions);
