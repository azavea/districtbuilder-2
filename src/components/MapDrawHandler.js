import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import './mapbox-gl.css';

import { clickGeounit } from '../actions';

class MapDrawHandler extends Component {
  componentWillMount() {
    this.modes = MapboxDraw.modes;
    this.modes.draw_rectangle = DrawRectangle;

    this.Draw = new MapboxDraw({
      modes: this.modes,
      boxSelect: false,
      displayControlsDefault: false,
    });

    this.props.map.addControl(this.Draw);

    this.props.map.on('draw.update', function(e) {
      console.log('update', e);
    });
    this.props.map.on('draw.create', function(e) {
      console.log('create', e);
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
