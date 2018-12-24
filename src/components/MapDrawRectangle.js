import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import {
  pointerSelect,
  rectangleSelect,
  rectangleStart,
  activateResults,
  selectResults,
} from '../actions';

class MapDrawHandler extends Component {
  componentWillMount() {
    this.onRectangleActivateDebounced = debounce(
      data => {
        window.updateHighlightWorker.postMessage(data);
      },
      200,
      { maxWait: 500 }
    );

    this.props.map.on('draw.create', e => {
      const assignedDistricts = new Int8Array(this.props.districts).buffer;
      window.updateHighlightWorker.postMessage(
        {
          type: 'SELECT',
          lockedIds: this.props.lockedIds,
          assignedDistricts: assignedDistricts,
          selectionLevel: this.props.selectionLevel,
          drawLimit: this.props.drawLimit,
          rectangle: e.features[0],
          rectangleStartId: this.props.rectangleStartId,
        },
        [assignedDistricts]
      );
      this.props.draw.deleteAll();
      setTimeout(() => {
        this.props.draw.changeMode('draw_rectangle');
      }, 0);
    });

    this.props.map.on('draw.move', e => {
      const assignedDistricts = new Int8Array(this.props.districts).buffer;
      this.onRectangleActivateDebounced(
        {
          type: 'ACTIVATE',
          lockedIds: this.props.lockedIds,
          assignedDistricts: assignedDistricts,
          selectionLevel: this.props.selectionLevel,
          drawLimit: this.props.drawLimit,
          rectangle: e.features[0],
          rectangleStartId: this.props.rectangleStartId,
        },
        [assignedDistricts]
      );
    });

    window.updateHighlightWorker.addEventListener('message', m => {
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
    });
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
