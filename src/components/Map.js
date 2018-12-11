import React, { Component } from 'react';
import MapboxGL from 'mapbox-gl';
import './mapbox-gl.css';

import MapDistrictLayer from './MapDistrictLayer';
import MapHighlightLayer from './MapHighlightLayer';
import MapLockLayer from './MapLockLayer';
import MapOptions from './MapOptions';
import MapDrawHandler from './MapDrawHandler';
import MapLayerHandler from './MapLayerHandler';
import { mapboxStyle } from '../constants/map-style';

MapboxGL.accessToken = 'pk.eyJ1IjoibGtuYXJmIiwiYSI6IjhjbGg4RUkifQ.-lS6mAkmR3SVh-W4XwQElg';

class Map extends Component {
  componentDidMount() {
    this.map = new MapboxGL.Map({
      container: this.mapContainer,
      style: mapboxStyle,
      center: [-77.63, 40.83],
      zoom: 6.5,
    });

    this.map.doubleClickZoom.disable();

    // TODO: Find a better way to handle this forceUpdate. Right now I am using this to render the component
    // after the map has loaded. Otherwise, the this.map is not passed into the other components.
    this.map.on('load', () => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className="map">
        <div ref={el => (this.mapContainer = el)} />
        {this.map && <MapDistrictLayer map={this.map} />}
        {this.map && <MapHighlightLayer map={this.map} />}
        {this.map && <MapDrawHandler map={this.map} />}
        {this.map && <MapLayerHandler map={this.map} />}
        {this.map && <MapLockLayer map={this.map} />}
        {this.map && <MapOptions />}
      </div>
    );
  }
}

export default Map;
