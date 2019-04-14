import React, { Component } from 'react';
import { connect } from 'react-redux';
import geobuf from 'geobuf';
import Pbf from 'pbf';
import FileSaver from 'file-saver';

class MapDownloadHandler extends Component {
  onDownload = () => {
    window.spatialWorker.postMessage({
      type: 'DOWNLOAD_GEOJSON',
      assignedDistricts: this.props.districts,
    });
  };

  componentDidMount() {
    window.spatialWorker &&
      window.spatialWorker.addEventListener('message', m => {
        switch (m.data.type) {
          case 'DOWNLOAD_GEOJSON':
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
    return (
      window.spatialWorker && (
        <button data-rh="Download GeoJSON" onClick={() => this.onDownload()}>
          <i className="icon-download" />
        </button>
      )
    );
  }
}

const mapStateToProps = (state, props) => {
  return { districts: state.historyState.present.districts };
};

export default connect(mapStateToProps)(MapDownloadHandler);
