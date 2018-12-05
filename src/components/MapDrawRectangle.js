import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';

import { rectangleSelect, rectangleActivate } from '../actions';

class MapDrawRectangle extends Component {
  componentWillMount() {
    this.props.map.addControl(this.Draw);

    this.onRectangleActivateThrottled = throttle(this.props.onRectangleActivate, 250);

    this.props.map.on('draw.create', e => {
      this.props.onRectangleSelect(e.features[0]);
      this.Draw.deleteAll();
      setTimeout(() => {
        this.Draw.changeMode('draw_rectangle');
      }, 0);
    });

    this.props.map.on('draw.move', e => {
      // if (this.props.rectangleStart) {
      console.log(this.props.rectangleStart);
      this.onRectangleActivateThrottled(e.features[0]);
      // this.onRectangleActivateThrottled({
      //   feature: e.features[0],
      //   countyfp: this.props.rectangleStart,
      // });
      // }
    });
  }

  render() {
    return <div className="map-draw-handler"> {this.props.rectangleStart} </div>;
  }
}

const mapActionsToProps = {
  onRectangleSelect: rectangleSelect,
  onRectangleActivate: rectangleActivate,
};

const mapStateToProps = state => {
  return {
    rectangleStart: state.rectangleStart,
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(MapDrawRectangle);
