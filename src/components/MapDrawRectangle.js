import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bbox } from '@turf/turf';
import flat from 'array.prototype.flat';

import { withMap } from './Context';
import { assignedFilter, lockedFilter, countyFilter } from '../util/drawfilter';

import {
  activateResults,
  selectResults,
  changeActiveCounty,
  changeRectangleInProgress,
} from '../actions';

class MapDrawHandler extends Component {
  componentDidMount() {
    this.onRectangleActivate = (rectangle, action) => {
      const {
        lockedIds,
        districts,
        map,
        selectionLevel,
        selectedDistrict,
        optionDrawUnassigned,
        optionDrawCountyLimit,
      } = this.props;
      const rectangleBbox = bbox(rectangle);
      const southWest = [rectangleBbox[0], rectangleBbox[1]];
      const northEast = [rectangleBbox[2], rectangleBbox[3]];
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
                    lockedFilter(lockedIds, districts, feature.properties.blockgroup_id) &&
                    (!optionDrawUnassigned ||
                      assignedFilter(districts, selectedDistrict, feature.properties.blockgroup_id)) &&
                    (!optionDrawCountyLimit ||
                      countyFilter(this.props.activeCounty, feature.properties.blockgroup_id))
                  );
                })
                .map(feature => feature.properties.blockgroup_id)
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
                return (
                  lockedFilter(lockedIds, districts, id) &&
                  (!optionDrawUnassigned || assignedFilter(districts, selectedDistrict, id))
                );
              })
            ),
          ]);
          break;
        default:
          break;
      }
    };

    this.onRectangleActivateDebounced = debounce(this.onRectangleActivate, 200, { maxWait: 500 });

    this.props.map.on('draw.create', e => {
      this.props.onChangeRectangleInProgress(false);
      this.onRectangleActivate(e.features[0], this.props.onSelectResults);
      this.props.draw.deleteAll();
      setTimeout(() => {
        this.props.draw.changeMode('draw_rectangle');
      }, 0);
    });

    this.props.map.on('draw.start', e => {
      this.props.onChangeRectangleInProgress(true);
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
    selectedDistrict: state.historyState.present.selectedDistrict,
    selectionLevel: state.selectionLevel,
    drawLimit: state.drawLimit,
    activeCounty: state.activeCounty,
    optionDrawCountyLimit: state.optionDrawCountyLimit,
    optionDrawUnassigned: state.optionDrawUnassigned,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onActivateResults: ids => dispatch(activateResults(ids)),
    onSelectResults: ids => dispatch(selectResults(ids)),
    onChangeActiveCounty: countyId => dispatch(changeActiveCounty(countyId)),
    onChangeRectangleInProgress: status => dispatch(changeRectangleInProgress(status)),
  };
};

export default withMap(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MapDrawHandler)
);
