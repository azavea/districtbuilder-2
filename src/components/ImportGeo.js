import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { bbox, featureCollection, centerOfMass, tag } from '@turf/turf';
import flat from 'array.prototype.flat';

import { hoverResults, selectResults, activatePaintResults, importDistricts } from '../actions';
import { withMap } from './Context';
import { geounitLayerName, countyLayerName } from '../constants';
import { indexOfMax } from '../util/data';

class ImportGeo extends Component {
  componentDidMount() {
    const { map, onImportDistricts } = this.props;
    var apiRequest1 = fetch('data/imported-districts.geojson').then(function(response) {
      return response.json();
    });
    var apiRequest2 = fetch('data/pa-bg.geojson').then(function(response) {
      return response.json();
    });
    Promise.all([apiRequest1, apiRequest2]).then(function(values) {
      const { districts, blockgroups } = { districts: values[0], blockgroups: values[1] };
      const centers = featureCollection(
        blockgroups.features.map(feature => {
          // console.log(feature);
          var com = centerOfMass(feature);
          com.properties.id = feature.properties.id;
          return com;
        })
      );
      const tagged = tag(centers, districts, 'DISTRICT_I', 'districtId');
      const final = tagged.features.map(feature => {
        return feature.properties.districtId;
      });
      onImportDistricts(final);
    });
  }
  render() {
    return <div className="import-geo" />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onImportDistricts: districts => dispatch(importDistricts(districts)),
  };
};

export default withMap(
  connect(
    undefined,
    mapDispatchToProps
  )(ImportGeo)
);
