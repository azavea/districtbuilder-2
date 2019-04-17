import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bbox } from '@turf/turf';
import flat from 'array.prototype.flat';

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

    this.lockedFilter = (lockedIds, districts, id) => {
      return !lockedIds[districts[id]];
    };

    this.selectedFilter = (selectedDistrict, districts, id) => {
      return id !== selectedDistrict;
    };

    this.onRectangleActivate = (bbox, action) => {
      const { lockedIds, districts, map, selectionLevel, selectedDistrict } = this.props;
      const southWest = [bbox[0], bbox[1]];
      const northEast = [bbox[2], bbox[3]];
      const southWestPointPixel = this.props.map.project(southWest);
      const northEastPointPixel = this.props.map.project(northEast);

      switch (selectionLevel) {
        case 'geounit':
          action([
            ...new Set(
              map
                .queryRenderedFeatures([southWestPointPixel, northEastPointPixel], {
                  layers: ['geounits-fill'],
                })
                .filter(feature => {
                  return (
                    // this.selectedFilter(selectedDistrict, districts, feature.properties.id) &&
                    this.lockedFilter(lockedIds, districts, feature.properties.id)
                  );
                })
                .map(feature => feature.properties.id)
            ),
          ]);
          break;
        case 'county':
          action([
            ...new Set(
              flat(
                map
                  .queryRenderedFeatures([southWestPointPixel, northEastPointPixel], {
                    layers: ['counties-fill'],
                  })
                  .map(feature => window.dataCountyIndex[feature.properties.countyfp].geounits)
              ).filter(id => {
                return this.lockedFilter(lockedIds, districts, id);
              })
            ),
          ]);
          break;
        default:
          break;
      }
    };

    this.onRectangleActivateDebounced = debounce(this.onRectangleActivate, 200, { maxWait: 500 });
    this.onPaintActivateDebounced = debounce(this.onRectangleActivate, 1, { maxWait: 1 });

    this.props.map.on('draw.create', e => {
      this.onRectangleActivate(bbox(e.features[0]), this.props.onSelectResults);
      this.props.draw.deleteAll();
      setTimeout(() => {
        this.props.draw.changeMode('draw_rectangle');
      }, 0);
    });

    this.props.map.on('draw.move', e => {
      this.onRectangleActivateDebounced(bbox(e.features[0]), this.props.onActivateResults);
    });

    this.props.map.on('mousemove', e => {
      const { lng, lat } = e.lngLat;
      const brushSize = 0.1;
      const paintBbox = [lng - brushSize, lat - brushSize, lng + brushSize, lat + brushSize];
      // this.onRectangleActivate(paintBbox, this.props.onActivateResults);
    });
  }
  render() {
    return <div className="map-draw-rectangle" />;
  }
}

const mapStateToProps = state => {
  return {
    selectedDistrict: state.historyState.present.selectedDistrict,
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
