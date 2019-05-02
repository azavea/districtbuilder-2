import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withMap } from './Context';

class MapLabelHandler extends Component {
  componentDidUpdate() {
    const { mapLabels, selectionLevel, map } = this.props;
    const cities = [
      'town-small',
      'town-medium',
      'town-large',
      'city-small',
      'city-medium',
      'city-large',
    ];
    if (mapLabels === 'city') {
      cities.forEach(city => map.setLayoutProperty(city, 'visibility', 'visible'));
    } else {
      cities.forEach(city => map.setLayoutProperty(city, 'visibility', 'none'));
    }
    if (mapLabels === 'county') {
      map.setLayoutProperty('county-name-labels', 'visibility', 'visible');
    } else {
      map.setLayoutProperty('county-name-labels', 'visibility', 'none');
    }
    const split = mapLabels.split('-');
    if (split[0] === 'pop') {
      if (selectionLevel === 'county') {
        console.log(split[1]);
        map.setLayoutProperty('county-population-labels', 'visibility', 'visible');
        map.setLayoutProperty('county-population-labels', 'text-field', `{${split[1]}abbr}`);
        map.setLayoutProperty('geounit-population-labels', 'visibility', 'none');
      } else {
        map.setLayoutProperty('geounit-population-labels', 'visibility', 'visible');
        map.setLayoutProperty('geounit-population-labels', 'text-field', `{${split[1]}abbr}`);
        map.setLayoutProperty('county-population-labels', 'visibility', 'none');
      }
    } else {
      map.setLayoutProperty('geounit-population-labels', 'visibility', 'none');
      map.setLayoutProperty('county-population-labels', 'visibility', 'none');
    }
  }
  render() {
    return <div className="map-label-handler" />;
  }
}

const mapStateToProps = state => {
  return {
    mapNumber: state.mapNumber,
    selectionLevel: state.selectionLevel,
    mapCountyName: state.mapCountyName,
    mapLabels: state.mapLabels,
  };
};

export default withMap(connect(mapStateToProps)(MapLabelHandler));
