import React, { Component } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import memoize from 'memoizee';

import { withMap } from './Context';
import { rectTooltipHtml, pointerTooltipHtml } from '../util/tooltip';
import { changeActiveCounty } from '../actions';

class MapTooltip extends Component {
  state = {
    hover: 0,
    point: {
      x: 0,
      y: 0,
    },
    feature: {
      properties: {
        statefp: undefined,
        countyfp: undefined,
        name: undefined,
        population: undefined,
        white: undefined,
        black: undefined,
        asian: undefined,
        hispanic: undefined,
        other: undefined,
      },
    },
  };
  onMouseMoveThrottled = throttle(e => {
    if (e.features) {
      console.log(e.features, e.features[0]);
      const feature = e.features[0];
      const county = feature.properties.countyfp;
      const { activeCounty, clickDown, onChangeActiveCounty, rectangleInProgress } = this.props;
      // If the user is not drawing and the county they are hovering on has changed, set the new
      // as the active county
      if (!clickDown && activeCounty !== county && !rectangleInProgress) {
        onChangeActiveCounty(county);
      }
      this.setState({
        feature: feature,
        hover: 1,
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY,
      });
    }
  }, 5);
  componentDidMount() {
    this.setEvents();
    this.props.map.on('drag', e => {
      this.setState({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
    });
  }
  setEvents = () => {
    switch (this.props.selectionLevel) {
      case 'county':
        this.props.map.on('mousemove', 'counties-fill', this.onMouseMove);
        this.props.map.on('mouseleave', 'counties-fill', this.onMouseLeave);
        this.props.map.off('mousemove', 'geounits-fill', this.onMouseMove);
        this.props.map.off('mouseleave', 'geounits-fill', this.onMouseLeave);
        break;
      case 'geounit':
        this.props.map.on('mousemove', 'geounits-fill', this.onMouseMove);
        this.props.map.on('mouseleave', 'geounits-fill', this.onMouseLeave);
        this.props.map.off('mousemove', 'counties-fill', this.onMouseMove);
        this.props.map.off('mouseleave', 'counties-fill', this.onMouseLeave);
        break;
      default:
        break;
    }
  };
  onMouseMove = e => {
    this.onMouseMoveThrottled(e);
  };
  onMouseLeave = e => {
    this.setState({ hover: 0 });
  };

  memoizePointerTooltipHtml = memoize(pointerTooltipHtml, {
    max: 1,
    primitive: true,
    length: 1,
  });

  memoizeRectTooltipHtml = memoize(rectTooltipHtml, {
    max: 1,
    primitive: true,
    length: 1,
  });

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectionLevel !== this.props.selectionLevel) {
      this.setEvents();
    }
  }
  render() {
    let html;
    if (this.props.rectangleInProgress || this.props.clickDown) {
      html = this.memoizeRectTooltipHtml(this.props.activeIds);
    } else if (this.props.drawMode === 'paintbrush') {
      html = this.memoizeRectTooltipHtml(this.props.hoverIds);
    } else {
      html = this.memoizePointerTooltipHtml(
        this.state.feature.id,
        this.state.feature,
        this.props.selectionLevel,
        this.props.selectedDistrict,
        this.props.districtColors
      );
    }
    const showPopup = this.props.rectangleInProgress || this.state.hover;
    const style = {
      transform: `translate3d(${this.state.x}px, ${this.state.y}px, 0)`,
      display: showPopup ? 'block' : 'none',
    };
    return (
      <div style={style} className="map-tooltip">
        {html}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    districtColors: state.districtColors,
    selectedDistrict: state.historyState.present.selectedDistrict,
    selectionLevel: state.selectionLevel,
    drawMode: state.drawMode,
    activeIds: state.activatedIds,
    hoverIds: state.hoveredIds,
    clickDown: state.clickDown,
    activeCounty: state.activeCounty,
    rectangleInProgress: state.rectangleInProgress,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeActiveCounty: e => dispatch(changeActiveCounty(e)),
  };
};

export default withMap(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MapTooltip)
);
