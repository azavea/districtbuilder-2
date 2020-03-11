import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactHintFactory from 'react-hint';
import 'react-hint/css/index.css';

import './css/main.scss';
import Map from './components/Map';
import MapDistrictLayer from './components/MapDistrictLayer';
import DistrictsSidebar from './components/DistrictsSidebar';
import MapHighlightLayer from './components/MapHighlightLayer';
import MapLockLayer from './components/MapLockLayer';
import MapDrawHandler from './components/MapDrawHandler';
import MapLayerHandler from './components/MapLayerHandler';
import MapLabelHandler from './components/MapLabelHandler';
import MapBasemapHandler from './components/MapBasemapHandler';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import KeyboardShortcutModal from './components/KeyboardShortcutModal';
import MapTooltip from './components/MapTooltip';
import MapActions from './components/MapActions';
import { generateAssignedDistricts } from './actions';
import MapDownloadHandler from './components/MapDownloadHandler';
import MapUndoHandler from './components/MapUndoHandler';
import spatialWorker from 'worker-loader!./workers/worker.js'; // eslint-disable-line import/no-webpack-loader-syntax
import { ToastContainer, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const ReactHint = ReactHintFactory(React);

class Builder extends Component {
  componentWillMount() {
    window.spatialWorker = new spatialWorker();
  }

  componentDidMount() {
    const featureRequest = fetch('data/bg-features.json').then(res => res.json());
    const countyIndexRequest = fetch('data/county-index.json').then(res => res.json());
    const assignedDistricts = fetch('data/assigned-districts.json').then(res => res.json());

    Promise.all([featureRequest, countyIndexRequest, assignedDistricts]).then(responses => {
      window.dataFeatures = responses[0];
      window.dataCountyIndex = responses[1];
      this.props.onGenerateAssignedDistricts(responses[2]);
    });
  }

  render() {
    return (
      <div className="builder">
        <KeyboardShortcuts />
        <div>
          <ToastContainer
            transition={cssTransition({
              enter: 'zoomIn',
              exit: 'zoomOut',
            })}
            pauseOnHover={false}
            hideProgressBar={true}
            autoClose={5000}
            position="bottom-center"
          />
        </div>
        <ReactHint autoPosition events={{ hover: true }} delay={{ show: 500, hide: 0 }} />
        <header>
          <div className="header-logo">
            <img src="/images/logo.png" alt="District Builder logo" />
          </div>
          <div className="header-title">North Carolina Congressional Districts</div>
          <div className="header-actions">
            <MapUndoHandler />
            <MapDownloadHandler />
            <KeyboardShortcutModal />
          </div>
        </header>
        <main>
          <DistrictsSidebar />
          <div className="map-container">
            <MapActions />
            <Map>
              <MapDistrictLayer />
              <MapHighlightLayer />
              <MapDrawHandler />
              <MapLayerHandler />
              <MapTooltip />
              <MapLabelHandler />
              <MapBasemapHandler />
              <MapLockLayer />
            </Map>
          </div>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onGenerateAssignedDistricts: assignedDistricts =>
      dispatch(generateAssignedDistricts(assignedDistricts)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Builder);
