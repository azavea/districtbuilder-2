import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/App.css';
import './css/db.css';
import Map from './components/Map';
import MapDistrictLayer from './components/MapDistrictLayer';
import DistrictsSidebar from './components/DistrictsSidebar';
import MapHighlightLayer from './components/MapHighlightLayer';
import MapLockLayer from './components/MapLockLayer';
import MapDrawHandler from './components/MapDrawHandler';
import MapLayerHandler from './components/MapLayerHandler';
import MapLabelHandler from './components/MapLabelHandler';
import MapBasemapHandler from './components/MapBasemapHandler';
import MapActions from './components/MapActions';
import { generateAssignedDistricts } from './actions';
import MapDownloadHandler from './components/MapDownloadHandler';
import MapUndoHandler from './components/MapUndoHandler';
import spatialWorker from 'worker-loader!./workers/worker.js'; // eslint-disable-line import/no-webpack-loader-syntax

class Builder extends Component {
    componentWillMount() {
        window.spatialWorker = new spatialWorker();

        const featureRequest = fetch('data/pa-bg.json').then(res => res.json());
        const countyIndexRequest = fetch('data/pa-county-index.json').then(res => res.json());
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
                <header>
                    <div className="header-logo">
                        <img src="/images/logo.png" alt="District Builder logo" />
                    </div>
                    <div className="header-title">Pennsylvania State House</div>
                    <div className="header-actions">
                        <MapUndoHandler />
                        {window.spatialWorker && <MapDownloadHandler />}
                    </div>
                </header>
                <main>
                    <DistrictsSidebar />
                    <div className="map-container">
                        <MapActions />
                        <Map>
                            <MapDistrictLayer />
                            <MapHighlightLayer />
                            <MapHighlightLayer />
                            <MapDrawHandler />
                            <MapLayerHandler />
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

const mapActionsToProps = {
    onGenerateAssignedDistricts: generateAssignedDistricts,
};

export default connect(
    null,
    mapActionsToProps
)(Builder);
