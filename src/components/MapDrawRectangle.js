import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { throttle } from 'lodash';
import './mapbox-gl.css';

import { pointerSelect, rectangleSelect, rectangleActivate } from '../actions';
import DrawRectangle from '../util/mapbox-gl-draw-rectangle-mode';

class MapDrawHandler extends Component {
  componentWillMount() {
    this.onRectangleActivateThrottled = throttle(this.props.onRectangleActivate, 250);

    this.props.map.on('draw.create', e => {
      console.log('draw.create');
      this.props.onRectangleSelect(e.features[0]);
      this.props.draw.deleteAll();
      setTimeout(() => {
        this.props.draw.changeMode('draw_rectangle');
      }, 0);
    });

    this.props.map.on('draw.move', e => {
      this.onRectangleActivateThrottled(e.features[0]);
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
