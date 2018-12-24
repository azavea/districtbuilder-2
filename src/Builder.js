import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/App.css';
import './css/db.css';
import Map from './components/Map';
import DistrictsSidebar from './components/DistrictsSidebar';
import MapActions from './components/MapActions';
import { generateAssignedDistricts } from './actions';
import updateHighlightWorker from 'worker-loader!./workers/worker.js'; // eslint-disable-line import/no-webpack-loader-syntax

class Builder extends Component {
    componentDidMount() {
        window.updateHighlightWorker = new updateHighlightWorker();

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
                <DistrictsSidebar />
                <MapActions />
                <div className="map-container">
                    <Map />
                </div>
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
