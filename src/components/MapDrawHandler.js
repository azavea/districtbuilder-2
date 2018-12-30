import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import MapDrawRectangle from './MapDrawRectangle';
import { pointerSelect, rectangleStart } from '../actions';
import DrawRectangle from '../util/mapbox-gl-draw-rectangle-mode';

class MapDrawHandler extends Component {
  componentWillMount() {
    this.modes = MapboxDraw.modes;
    this.modes.draw_rectangle = DrawRectangle;
    this.draw = new MapboxDraw({
      modes: this.modes,
      boxSelect: false,
      displayControlsDefault: false,
      styles: [
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#444',
            'line-width': 1,
          },
        },
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#444',
            'fill-opacity': 0.4,
          },
        },
      ],
    });
  }
  render() {
    if (this.props.drawMode === 'pointer') {
      this.props.map.on('click', 'geounits-fill', this.props.onPointerSelect);
      this.props.map.getCanvas().style.cursor = 'pointer';
    } else {
      this.props.map.off('click', 'geounits-fill', this.props.onPointerSelect);
    }
    if (this.props.drawMode === 'rectangle') {
      this.myDrawControl = this.props.map.addControl(this.draw);
      this.draw.changeMode('draw_rectangle');
      this.props.map.on('click', 'geounits-fill', this.props.onRectangleStart);
      this.props.map.getCanvas().style.cursor = 'crosshair';
    } else {
      if (this.myDrawControl) {
        this.props.map.removeControl(this.draw);
      } else {
        this.myDrawControl = undefined;
      }
      this.props.map.off('click', 'geounits-fill', this.props.onRectangleStart);
    }
    return (
      <div className="map-draw-handler">
        <MapDrawRectangle map={this.props.map} draw={this.draw} />
      </div>
    );
  }
}

const mapActionsToProps = {
  onPointerSelect: pointerSelect,
  onRectangleStart: rectangleStart,
};

const mapStateToProps = state => {
  return {
    drawMode: state.drawMode,
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapDrawHandler);
