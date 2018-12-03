import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';
import Map from './components/Map';
import DistrictsSidebar from './components/DistrictsSidebar';
import MapActions from './components/MapActions';
import { fetchTopoAndGenerateGeo } from './actions';

class App extends Component {
    componentDidMount() {
        this.props.onFetchTopoAndGenerateGeo();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <DistrictsSidebar />
                    <div className="map-container">
                        <MapActions />
                        <Map />
                    </div>
                </header>
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
)(App);
