import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import DrawRectangle from '../util/mapbox-gl-draw-rectangle-mode';
import MapDrawRectangle from './MapDrawRectangle';
import { drawStyle } from '../constants/map-style';
import { pointerSelect, rectangleStart } from '../actions';
import { withMap } from './Context';

class MapDrawHandler extends Component {
  changeMapDrawTool = () => {
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
  };
  componentDidMount() {
    this.modes = MapboxDraw.modes;
    this.modes.draw_rectangle = DrawRectangle;
    this.draw = new MapboxDraw({
      modes: this.modes,
      boxSelect: false,
      displayControlsDefault: false,
      styles: drawStyle,
    });
    this.changeMapDrawTool();
  }
  componentDidUpdate() {
    this.changeMapDrawTool();
  }
  render() {
    return (
      <div className="map-draw-handler">
        <MapDrawRectangle draw={this.draw} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawMode: state.drawMode,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPointerSelect: e => dispatch(pointerSelect(e)),
    onRectangleStart: e => dispatch(rectangleStart(e)),
  };
};

export default withMap(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MapDrawHandler)
);
