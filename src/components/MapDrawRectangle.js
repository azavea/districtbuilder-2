import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import './mapbox-gl.css';

import { pointerSelect, rectangleSelect, rectangleActivate, rectangleStart } from '../actions';

class MapDrawHandler extends Component {
  componentWillMount() {
    this.onRectangleActivateThrottled = throttle(this.props.onRectangleActivate, 300);

    this.props.map.on('draw.create', e => {
      console.log('draw.create');
      this.props.onRectangleSelect({
        rectangle: e.features[0],
        rectangleStartId: this.props.rectangleStartId,
      });
      this.props.draw.deleteAll();
      setTimeout(() => {
        this.props.draw.changeMode('draw_rectangle');
      }, 0);
    });

    this.props.map.on('draw.move', e => {
      this.onRectangleActivateThrottled({
        rectangle: e.features[0],
        rectangleStartId: this.props.rectangleStartId,
      });
    });
  }
  render() {
    return <div className="map-draw-rectangle" />;
  }
}

const mapActionsToProps = {
  onPointerSelect: pointerSelect,
  onRectangleSelect: rectangleSelect,
  onRectangleActivate: rectangleActivate,
  onRectangleStart: rectangleStart,
};

const mapStateToProps = state => {
  return {
    drawMode: state.drawMode,
    rectangleStartId: state.rectangleStartId,
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapDrawHandler);
