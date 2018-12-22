import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';

import {
  pointerSelect,
  rectangleSelect,
  rectangleStart,
  activateResults,
  selectResults,
} from '../actions';
import spatialSearchWorker from 'worker-loader!../workers/spatial-search-worker.js'; // eslint-disable-line import/no-webpack-loader-syntax

class MapDrawHandler extends Component {
  componentWillMount() {
    this.onRectangleActivateThrottled = throttle(data => {
      window.spatialSearchWorker.postMessage(data);
    }, 500);

    this.props.map.on('draw.create', e => {
      window.spatialSearchWorker.postMessage({
        type: 'SELECT',
        lockedIds: this.props.lockedIds,
        assignedDistricts: this.props.districts.assigned,
        selectionLevel: this.props.selectionLevel,
        drawLimit: this.props.drawLimit,
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
        type: 'ACTIVATE',
        lockedIds: this.props.lockedIds,
        assignedDistricts: this.props.districts.assigned,
        selectionLevel: this.props.selectionLevel,
        drawLimit: this.props.drawLimit,
        rectangle: e.features[0],
        rectangleStartId: this.props.rectangleStartId,
      });
    });

    window.spatialSearchWorker = new spatialSearchWorker();

    window.spatialSearchWorker.postMessage({
      type: 'INIT',
      geoJSON: window.dataGeoJSON,
    });

    window.spatialSearchWorker.onmessage = m => {
      switch (m.data.type) {
        case 'SELECT':
          this.props.onSelectResults(m.data.results);
          break;
        case 'ACTIVATE':
          this.props.onActivateResults(m.data.results);
          break;
        default:
          break;
      }
      m = null;
    };
  }
  render() {
    return <div className="map-draw-rectangle" />;
  }
}

const mapActionsToProps = {
  onPointerSelect: pointerSelect,
  onRectangleSelect: rectangleSelect,
  onActivateResults: activateResults,
  onSelectResults: selectResults,
  onRectangleStart: rectangleStart,
};

const mapStateToProps = state => {
  return {
    drawMode: state.drawMode,
    rectangleStartId: state.rectangleStartId,
    lockedIds: state.lockedIds,
    districts: state.districts,
    selectionLevel: state.selectionLevel,
    drawLimit: state.drawLimit,
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapDrawHandler);
