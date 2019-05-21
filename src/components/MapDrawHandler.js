import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import DrawRectangle from '../util/mapbox-gl-draw-rectangle-mode';
import MapDrawRectangle from './MapDrawRectangle';
import MapDrawPaint from './MapDrawPaint';
import { drawStyle } from '../constants/map-style';
import { pointerSelect, rectangleStart, clickDown, spaceDown, selectActivated } from '../actions';
import { withMap } from './Context';

class MapDrawHandler extends Component {
  mouseDown = false;
  spaceDown = false;
  handleMouseEvents = e => {
    if (e.type === 'mousedown') {
      this.props.onClickDown(true);
    } else if (e.type === 'mouseup') {
      this.props.onClickDown(false);
      this.props.onSelectActivated();
    }
  };
  onPaint = e => {
    this.props.map.fire('paint', e);
  };
  onKeyInteraction = e => {
    switch (e.keyCode) {
      case 32: {
        if (e.type === 'keydown') {
          if (!e.repeat) {
            this.props.onSpaceDown(true);
            this.props.map.dragPan.enable();
            this.props.map.getCanvas().style.cursor = '';
            this.props.map.getCanvas().classList.remove('painting');
          }
        } else {
          this.props.onSpaceDown(false);
          this.props.map.dragPan.disable();
          this.props.map.getCanvas().classList.add('painting');
        }
        break;
      }
      default:
        break;
    }
  };
  changeMapDrawTool = () => {
    if (this.props.drawMode === 'paintbrush') {
      this.props.map.getCanvas().classList.add('painting');
      setTimeout(() => {
        this.props.map.dragPan.disable();
      }, 0);
      document.body.addEventListener('keydown', this.onKeyInteraction);
      document.body.addEventListener('keyup', this.onKeyInteraction);
      this.props.map.on('mousedown', this.handleMouseEvents);
      this.props.map.on('mouseup', this.handleMouseEvents);
      this.props.map.on('mousemove', this.onPaint);
      this.props.map.on('mousedown', this.onPaint);
    } else {
      this.props.map.getCanvas().classList.remove('painting');
      this.props.map.dragPan.enable();
      document.body.removeEventListener('keydown', this.onKeyInteraction);
      document.body.removeEventListener('keyup', this.onKeyInteraction);
      this.props.map.off('mousedown', this.handleMouseEvents);
      this.props.map.off('mouseup', this.handleMouseEvents);
      this.props.map.off('mousemove', this.onPaint);
      this.props.map.off('mousedown', this.onPaint);
    }
    if (this.props.drawMode === 'pointer') {
      this.props.map.on('click', 'geounits-fill', this.props.onPointerSelect);
      this.props.map.getCanvas().style.cursor = 'pointer';
    } else {
      this.props.map.off('click', 'geounits-fill', this.props.onPointerSelect);
    }
    if (this.props.drawMode === 'rectangle') {
      this.myDrawControl = this.props.map.addControl(this.draw);
      this.draw.changeMode('draw_rectangle');
      this.props.map.getCanvas().style.cursor = 'crosshair';
    } else {
      if (this.myDrawControl) {
        this.props.map.removeControl(this.draw);
        this.myDrawControl = undefined;
      }
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
        <MapDrawPaint />
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
    onClickDown: e => dispatch(clickDown(e)),
    onSpaceDown: e => dispatch(spaceDown(e)),
    onSelectActivated: e => dispatch(selectActivated()),
  };
};

export default withMap(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MapDrawHandler)
);
