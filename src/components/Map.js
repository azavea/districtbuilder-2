import React, { Component } from 'react';
import MapboxGL from 'mapbox-gl';
import { connect } from 'react-redux';
import './mapbox-gl.css';

import MapDistrictLayer from './MapDistrictLayer';
import MapHighlightLayer from './MapHighlightLayer';
import MapDrawHandler from './MapDrawHandler';
import { mapboxStyle } from '../constants/map-style';

MapboxGL.accessToken = 'pk.eyJ1IjoibGtuYXJmIiwiYSI6IjhjbGg4RUkifQ.-lS6mAkmR3SVh-W4XwQElg';

class Map extends Component {
  componentDidMount() {
    this.map = new MapboxGL.Map({
      container: this.mapContainer,
      style: mapboxStyle,
      center: [-78.037, 40.031],
      zoom: 6,
    });

    this.map.doubleClickZoom.disable();

    this.map.on('mousemove', 'blockgroups-fill', e => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'blockgroups-fill', e => {
      this.map.getCanvas().style.cursor = '';
    });

    // TODO: Find a better way to handle this forceUpdate. Right now I am using this to render the component
    // after the map has loaded. Otherwise, the this.map is not passed into the other components.
    this.forceUpdate();
  }

  render() {
    return (
      <div className="map">
        <div ref={el => (this.mapContainer = el)} />
        {this.map && <MapDistrictLayer map={this.map} />}
        {this.map && <MapHighlightLayer map={this.map} />}
        {this.map && <MapHighlightLayer map={this.map} />}
        {this.map && <MapDrawHandler map={this.map} />}
      </div>
    );
  }
}

export default Map;
