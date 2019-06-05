import React, { Component } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import flat from 'array.prototype.flat';

import { hoverResults, activatePaintResults } from '../actions';
import { withMap } from './Context';
import { geounitLayerName, countyLayerName } from '../constants';
import { assignedFilter, lockedFilter, countyFilter } from '../util/drawfilter';

class MapDrawPaint extends Component {
  active = [];

  removeHover = (active, sourceLayer) => {
    active.forEach(id => {
      this.props.map.setFeatureState(
        {
          source: 'blockgroups',
          sourceLayer: sourceLayer,
          id: id,
        },
        { hover: false }
      );
    });
  };

  onPaintStroke = e => {
    const { lng, lat } = e.lngLat;
    const brushSize = 0.025;
    const paintBbox = [lng - brushSize, lat - brushSize, lng + brushSize, lat + brushSize];
    this.onRectangleActivate(paintBbox, this.props.onActivatePaintResults, e.originalEvent.type);
  };

  onRectangleActivate = (bbox, action, type) => {
    const {
      lockedIds,
      districts,
      map,
      selectionLevel,
      optionDrawCountyLimit,
      optionDrawUnassigned,
      selectedDistrict,
    } = this.props;
    const southWest = [bbox[0], bbox[1]];
    const northEast = [bbox[2], bbox[3]];
    const southWestPointPixel = this.props.map.project(southWest);
    const northEastPointPixel = this.props.map.project(northEast);

    switch (selectionLevel) {
      case 'geounit': {
        this.removeHover(this.active, geounitLayerName);
        const hovered = map
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
          });
        this.active = hovered.map(feature => feature.id);
        const activePropIds = hovered.map(feature => feature.properties.blockgroup_id);
        this.props.onHoverResults(activePropIds);
        hovered.forEach(feature => {
          this.props.map.setFeatureState(
            {
              source: 'blockgroups',
              sourceLayer: geounitLayerName,
              id: feature.id,
            },
            { hover: true }
          );
        });
        if (!this.props.spaceDown && (this.props.clickDown || type === 'mousedown')) {
          action([
            ...new Set(
              hovered.map(feature => {
                return feature.properties.blockgroup_id;
              })
            ),
          ]);
        }
        break;
      }
      case 'county': {
        this.removeHover(this.active, countyLayerName);
        const hovered = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], {
          layers: ['counties-fill'],
        });
        this.active = hovered.map(feature => feature.id);
        this.active.forEach(id => {
          this.props.map.setFeatureState(
            {
              source: 'blockgroups',
              sourceLayer: countyLayerName,
              id: id,
            },
            { hover: true }
          );
        });
        const geounitIds = [
          ...new Set(
            flat(
              hovered.map(feature => window.dataCountyIndex[feature.properties.countyfp].geounits)
            )
          ),
        ];
        this.props.onHoverResults(geounitIds);
        if (!this.props.spaceDown && (this.props.clickDown || type === 'mousedown')) {
          action(
            geounitIds.filter(id => {
              return lockedFilter(lockedIds, districts, id);
            })
          );
        }
        break;
      }
      default:
        break;
    }
  };

  onPaintStrokeThrottled = throttle(this.onPaintStroke, 10);

  componentDidUpdate(prevProps) {
    if (prevProps.selectionLevel !== this.props.selectionLevel) {
      if (prevProps.selectionLevel === 'county') {
        this.removeHover(this.active, countyLayerName);
      } else {
        this.removeHover(this.active, geounitLayerName);
      }
    }
    if (prevProps.drawMode !== this.props.drawMode) {
      if (this.props.selectionLevel === 'county') {
        this.removeHover(this.active, countyLayerName);
      } else {
        this.removeHover(this.active, geounitLayerName);
      }
    }
  }

  componentDidMount() {
    this.props.map.on('paint', e => {
      this.onPaintStrokeThrottled(e);
    });
  }
  render() {
    return <div className="map-draw-paint" />;
  }
}

const mapStateToProps = state => {
  return {
    lockedIds: state.historyState.present.lockedIds,
    districts: state.historyState.present.districts,
    drawMode: state.drawMode,
    selectionLevel: state.selectionLevel,
    selectedDistrict: state.historyState.present.selectedDistrict,
    clickDown: state.clickDown,
    spaceDown: state.spaceDown,
    activeCounty: state.activeCounty,
    optionDrawCountyLimit: state.optionDrawCountyLimit,
    optionDrawUnassigned: state.optionDrawUnassigned,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHoverResults: ids => dispatch(hoverResults(ids)),
    onActivatePaintResults: ids => dispatch(activatePaintResults(ids)),
  };
};

export default withMap(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MapDrawPaint)
);
