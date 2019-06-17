
import React, { Component } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import memoize from 'memoizee';

import { pointerTooltipHtml } from '../util/tooltip';



class TT extends Component {

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
    
    console.log('move mouse throttle')
    if (e.features) {
      //console.log(e.features, e.features[0]);
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

  handleMouseOver(e) {
    console.log('handleClick!!!');
    this.setState({ x: e.screenX, y: e.screenY });
  };

  memoizePointerTooltipHtml = memoize(pointerTooltipHtml, {
    max: 1,
    primitive: true,
    length: 1,
  });

  componentDidMount() {
    console.log('derp')
  }

  onHoverTTChart = chart => {
    this.props.onHoverTTChart(chart);
  };

  render() {

    console.log('RENDER')

    let html;
    html = this.memoizePointerTooltipHtml(
        this.state.feature.id,
        this.state.feature,
        this.props.selectionLevel,
        this.props.selectedDistrict,
        this.props.districtColors
      );
    const style = {
      //transform: `translate3d(${this.state.x}px, ${this.state.y}px, 0)`,
      display: 'block' ,
    };

    return (
      <div onMouseOver={() => this.onHoverTTChart() } style= {style} className="sidebar-chart-tooltip">
        {html}
      </div>
    );
    // ...
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     onHoverTTChart: districtId => dispatch(selectDistrict(districtId))
//   };
// };

export default TT;
