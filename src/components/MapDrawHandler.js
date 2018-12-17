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
    });
  }
  render() {
    if (this.props.drawMode === 'pointer') {
      this.props.map.on('click', 'blockgroups-fill', this.props.onPointerSelect);
      this.props.map.getCanvas().style.cursor = 'pointer';
    } else {
      this.props.map.off('click', 'blockgroups-fill', this.props.onPointerSelect);
    }
    if (this.props.drawMode === 'rectangle') {
      this.myDrawControl = this.props.map.addControl(this.draw);
      this.draw.changeMode('draw_rectangle');
      this.props.map.on('click', 'blockgroups-fill', this.props.onRectangleStart);
      this.props.map.getCanvas().style.cursor = 'crosshair';
    } else {
      if (this.myDrawControl) {
        this.props.map.removeControl(this.draw);
      } else {
        this.myDrawControl = undefined;
      }
      this.props.map.off('click', 'blockgroups-fill', this.props.onRectangleStart);
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
