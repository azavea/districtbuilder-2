import React, { Component } from 'react';
import MapboxGL from 'mapbox-gl';
import '../css/mapbox-gl.css';
import ReactResizeDetector from 'react-resize-detector';

import MapDistrictLayer from './MapDistrictLayer';
import MapHighlightLayer from './MapHighlightLayer';
import MapLockLayer from './MapLockLayer';
import MapDrawHandler from './MapDrawHandler';
import MapLayerHandler from './MapLayerHandler';
import MapLabelHandler from './MapLabelHandler';
import MapCircleHandler from './MapCircleHandler';
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

  onResize = () => {
    this.map.resize();
    console.log('map resize');
  };

  render() {
    return (
      <div className="map">
        <div ref={ref => (this.mapContainer = ref)} />
        {<ReactResizeDetector handleWidth onResize={this.onResize} />}
        {this.map && <MapDistrictLayer map={this.map} />}
        {this.map && <MapHighlightLayer map={this.map} />}
        {this.map && <MapDrawHandler map={this.map} />}
        {this.map && <MapLayerHandler map={this.map} />}
        {this.map && <MapLabelHandler map={this.map} />}
        {this.map && <MapCircleHandler map={this.map} />}
        {this.map && <MapLockLayer map={this.map} />}
      </div>
    );
  }
}

export default Map;
