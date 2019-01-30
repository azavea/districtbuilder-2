import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bbox } from '@turf/turf';

import { activateResults, selectResults } from '../actions';
import { withMap } from './Context';

class MapDrawHandler extends Component {
  componentDidMount() {
    this.limitDrawFilter = (drawLimit, rectangleStartId, countyFps) => {
      return drawLimit ? rectangleStartId === countyFps : true;
    };

    this.lockedFilter = (lockedIds, districts, id) => {
      return !lockedIds[districts[id]];
    };

    this.onRectangleActivate = (rectangle, action) => {
      const { drawLimit, rectangleStartId, lockedIds, districts, map, selectionLevel } = this.props;
      const rectangleBbox = bbox(rectangle);
      const southWest = [rectangleBbox[0], rectangleBbox[1]];
      const northEast = [rectangleBbox[2], rectangleBbox[3]];
      const southWestPointPixel = this.props.map.project(southWest);
      const northEastPointPixel = this.props.map.project(northEast);

      switch (selectionLevel) {
        case 'geounit':
          action(
            map
              .queryRenderedFeatures([southWestPointPixel, northEastPointPixel], {
                layers: ['geounits-fill'],
              })
              .filter(feature => {
                return (
                  this.limitDrawFilter(drawLimit, rectangleStartId, feature.properties.countyfp) &&
                  this.lockedFilter(lockedIds, districts, feature.properties.id)
                );
              })
              .map(feature => feature.properties.id)
          );
          break;
        case 'county':
          action(
            map
              .queryRenderedFeatures([southWestPointPixel, northEastPointPixel], {
                layers: ['counties-fill'],
              })
              .map(feature => window.dataCountyIndex[feature.properties.countyfp])
              .flat()
              .filter(id => {
                return this.lockedFilter(lockedIds, districts, id);
              })
          );
          break;
        default:
          break;
      }
    };

    this.onRectangleActivateDebounced = debounce(this.onRectangleActivate, 200, { maxWait: 500 });

    this.props.map.on('draw.create', e => {
      this.onRectangleActivate(e.features[0], this.props.onSelectResults);
      this.props.draw.deleteAll();
      setTimeout(() => {
        this.props.draw.changeMode('draw_rectangle');
      }, 0);
    });

    this.props.map.on('draw.move', e => {
      this.onRectangleActivateDebounced(e.features[0], this.props.onActivateResults);
    });
  }
  render() {
    return <div className="map-draw-rectangle" />;
  }
}

const mapStateToProps = state => {
  return {
    rectangleStartId: state.rectangleStartId,
    lockedIds: state.historyState.present.lockedIds,
    districts: state.historyState.present.districts,
    selectionLevel: state.selectionLevel,
    drawLimit: state.drawLimit,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onActivateResults: ids => dispatch(activateResults(ids)),
    onSelectResults: ids => dispatch(selectResults(ids)),
  };
};

export default withMap(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MapDrawHandler)
);
