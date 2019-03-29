import React, { Component } from 'react';
import MapboxGL from 'mapbox-gl';
import '../css/mapbox-gl.css';
import ReactResizeDetector from 'react-resize-detector';

import { MapContext } from './Context';
import { mapboxStyle } from '../constants/map-style';

class Map extends Component {
  onResize = () => {
    this.map.resize();
  };

  componentDidMount() {
    this.map = new MapboxGL.Map({
      container: this.mapContainer,
      style: mapboxStyle,
      center: [-77.63, 41],
      zoom: 6.5,
      minZoom: 5,
      maxZoom: 15,
    });

    this.map.doubleClickZoom.disable();

    this.map.on('load', () => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <MapContext.Provider value={this.map}>
        <div ref={ref => (this.mapContainer = ref)} />
        {this.map && this.props.children}
        <ReactResizeDetector handleWidth onResize={this.onResize} />
      </MapContext.Provider>
    );
  }
}

export default Map;
