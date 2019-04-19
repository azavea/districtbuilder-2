import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { bbox } from '@turf/turf';
import flat from 'array.prototype.flat';

import { activateResults, selectResults } from '../actions';
import { withMap } from './Context';
import { geounitLayerName } from '../constants';

class MapDrawHandler extends Component {
  active = [];
  mouseDown = true;
  limitDrawFilter = (drawLimit, rectangleStartId, countyFps) => {
    return drawLimit ? rectangleStartId === countyFps : true;
  };

  lockedFilter = (lockedIds, districts, id) => {
    return !lockedIds[districts[id]];
  };

  lockedFilter = (lockedIds, districts, id) => {
    return !lockedIds[districts[id]];
  };

  selectedFilter = (selectedDistrict, districts, id) => {
    return id !== selectedDistrict;
  };

  removeHover = () => {
    this.active.forEach(feature => {
      this.props.map.setFeatureState(
        {
          source: 'blockgroups',
          sourceLayer: geounitLayerName,
          id: feature.id,
        },
        { hover: false }
      );
    });
  };

  onRectangleActivate = (bbox, action) => {
    const { lockedIds, districts, map, selectionLevel, selectedDistrict } = this.props;
    const southWest = [bbox[0], bbox[1]];
    const northEast = [bbox[2], bbox[3]];
    const southWestPointPixel = this.props.map.project(southWest);
    const northEastPointPixel = this.props.map.project(northEast);

    switch (selectionLevel) {
      case 'geounit':
        // if (!this.mouseDown) {
        this.removeHover();
        // }
        const hovered = map
          .queryRenderedFeatures([southWestPointPixel, northEastPointPixel], {
            layers: ['geounits-fill'],
          })
          .filter(feature => {
            return (
              // this.selectedFilter(selectedDistrict, districts, feature.properties.id) &&
              this.lockedFilter(lockedIds, districts, feature.properties.id)
            );
          });
        this.active = [...hovered, ...this.active];
        // Is it necessary to use the ...new Set opperation? Might be able to remove
        action([
          ...new Set(
            this.active.map(feature => {
              this.props.map.setFeatureState(
                {
                  source: 'blockgroups',
                  sourceLayer: geounitLayerName,
                  id: feature.id,
                },
                { hover: true }
              );
              return feature.properties.id;
            })
          ),
        ]);
        break;
      case 'county':
        this.removeHover();
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

  onRectangleActivateDebounced = debounce(this.onRectangleActivate, 200, { maxWait: 500 });
  onPaintActivateThrottled = throttle(this.onRectangleActivate, 500);

  componentDidMount() {
    this.props.map.dragPan.disable();
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
      const brushSize = 0.005;
      const paintBbox = [lng - brushSize, lat - brushSize, lng + brushSize, lat + brushSize];
      this.onPaintActivateThrottled(paintBbox, this.props.onActivateResults);
    });
    document.body.onmousedown = () => {
      this.mouseDown = true;
    };
    document.body.onmouseup = () => {
      this.mouseDown = false;
    };
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
