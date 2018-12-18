import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/App.css';
import './css/db.css';
import Map from './components/Map';
import DistrictsSidebar from './components/DistrictsSidebar';
import MapActions from './components/MapActions';
import { fetchTopoAndGenerateGeo } from './actions';
import { generateSpatialIndex } from './util';

class Builder extends Component {
    componentDidMount() {
        fetch('data/pa-bg.geojson')
            .then(res => res.json())
            .then(response => {
                window.dataGeoJSON = response;
                window.dataSpatialIndex = generateSpatialIndex(response);

                let countyIndex = {};
                response.features.forEach(feature => {
                    if (countyIndex[feature.properties.countyfp] === undefined) {
                        countyIndex[feature.properties.countyfp] = [];
                    }
                    countyIndex[feature.properties.countyfp].push(feature.properties.id);
                });
                window.dataCountyIndex = countyIndex;

                response = null;

                fetch('data/pa-bg.topojson')
                    .then(res2 => res2.json())
                    .then(response2 => {
                        window.dataTopoJSON = response2;
                        this.props.onFetchTopoAndGenerateGeo();
                        response2 = null;
                    });
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
    onFetchTopoAndGenerateGeo: fetchTopoAndGenerateGeo,
};

export default connect(
    null,
    mapActionsToProps
)(Builder);
