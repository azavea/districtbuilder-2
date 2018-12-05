import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { throttle } from 'lodash';
import './mapbox-gl.css';

import MapDrawRectangle from './MapDrawRectangle';
import { pointerSelect, rectangleSelect, rectangleActivate } from '../actions';
import DrawRectangle from '../util/mapbox-gl-draw-rectangle-mode';

class MapDrawHandler extends Component {
  componentWillMount() {
    console.log('MapDrawHandler: componentWillMount');
    this.modes = MapboxDraw.modes;
    this.modes.draw_rectangle = DrawRectangle;
    this.draw = new MapboxDraw({
      modes: this.modes,
      boxSelect: false,
      displayControlsDefault: false,
    });
    this.props.map.addControl(this.draw);
  }
  render() {
    console.log('MapDrawHandler: render');
    if (this.props.drawMode === 'Pointer') {
      this.props.map.on('click', 'blockgroups-fill', this.props.onPointerSelect);
      this.props.map.getCanvas().style.cursor = 'pointer';
    } else {
      this.props.map.off('click', 'blockgroups-fill', this.props.onPointerSelect);
    }
    if (this.props.drawMode === 'Rectangle') {
      this.draw.changeMode('draw_rectangle');
      this.props.map.getCanvas().style.cursor = 'crosshair';
    } else {
      this.draw.changeMode('simple_select');
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
  // onRectangleSelect: rectangleSelect,
  // onRectangleActivate: rectangleActivate,
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
