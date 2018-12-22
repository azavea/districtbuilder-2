import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/App.css';
import './css/db.css';
import Map from './components/Map';
import DistrictsSidebar from './components/DistrictsSidebar';
import MapActions from './components/MapActions';
import { generateAssignedDistricts } from './actions';

class Builder extends Component {
    componentDidMount() {
        const topoRequest = fetch('data/pa-bg.topojson').then(res => res.json());
        const geoRequest = fetch('data/pa-bg.geojson').then(res => res.json());
        const featureRequest = fetch('data/pa-bg.json').then(res => res.json());
        const countyIndexRequest = fetch('data/pa-county-index.json').then(res => res.json());

        Promise.all([topoRequest, geoRequest, featureRequest, countyIndexRequest]).then(
            responses => {
                window.dataTopoJSON = responses[0];
                window.dataGeoJSON = responses[1];
                window.dataFeatures = responses[2];
                window.dataCountyIndex = responses[3];
                this.props.onGenerateAssignedDistricts();
            }
        );
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
