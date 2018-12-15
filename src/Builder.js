import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/App.css';
import './css/db.css';
import Map from './components/Map';
import DistrictsSidebar from './components/DistrictsSidebar';
import MapActions from './components/MapActions';
import { fetchTopoAndGenerateGeo } from './actions';

class Builder extends Component {
    componentDidMount() {
        this.props.onFetchTopoAndGenerateGeo();
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
