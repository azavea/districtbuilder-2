import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { throttle } from 'lodash';
import './mapbox-gl.css';

import { clickGeounit, rectangleSelect, rectangleActivate } from '../actions';
import DrawRectangle from '../util/mapbox-gl-draw-rectangle-mode';

class MapDrawHandler extends Component {
  componentWillMount() {
    this.modes = MapboxDraw.modes;
    this.modes.draw_rectangle = DrawRectangle;
    this.onRectangleActivateThrottled = throttle(this.props.onRectangleActivate, 250);

    this.Draw = new MapboxDraw({
      modes: this.modes,
      boxSelect: false,
      displayControlsDefault: false,
    });

    this.props.map.addControl(this.Draw);

    this.props.map.on('draw.create', e => {
      console.log('draw.create');
      this.props.onRectangleSelect(e.features[0]);
      this.Draw.deleteAll();
      setTimeout(() => {
        this.Draw.changeMode('draw_rectangle');
      }, 0);
    });

    this.props.map.on('draw.move', e => {
      this.onRectangleActivateThrottled(e.features[0]);
    });
  }
  render() {
    if (this.props.drawMode === 'Pointer') {
      this.props.map.on('click', 'blockgroups-fill', this.props.onClickGeounit);
      this.props.map.getCanvas().style.cursor = 'pointer';
    } else {
      this.props.map.off('click', 'blockgroups-fill', this.props.onClickGeounit);
    }
    if (this.props.drawMode === 'Rectangle') {
      this.Draw.changeMode('draw_rectangle');
      this.props.map.getCanvas().style.cursor = 'crosshair';
    } else {
      this.Draw.changeMode('simple_select');
    }
    return <div className="map-draw-handler" />;
  }
}

const mapActionsToProps = {
  onClickGeounit: clickGeounit,
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
