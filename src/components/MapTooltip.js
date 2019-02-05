import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxGL from 'mapbox-gl';
import debounce from 'lodash/debounce';

import { withMap } from './Context';
import { abbreviateNumber } from '../util/data';

class MapTooltip extends Component {
  componentDidMount() {
    this.popup = new MapboxGL.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [10, 10],
      anchor: 'top-left',
    }).addTo(this.props.map);

    this.updatePopup = feature => {
      var content = `
        <h2>Block Group ${feature.properties.id}</h2>
        <h3>Pop. ${abbreviateNumber(feature.properties.population)}</h3>
      `;
      this.popup.setHTML(content);
    };

    this.onMouseMove = feature => {
      // this.props.map.getCanvas().style.cursor = 'pointer';
      this.updatePopup(feature);
    };

    this.updatePopupDebounced = debounce(this.onMouseMove, 100, { maxWait: 500 });

    this.props.map.on('mousemove', 'geounits-fill', e => {
      if (e.features.length > 0) {
        // console.log(e.features[0].properties);
        this.popup.setLngLat(e.lngLat);
        this.updatePopupDebounced(e.features[0]);
      }
    });

    this.props.map.on('mouseleave', 'geounits-fill', e => {
      console.log(this.popup.isOpen());
      console.log(this.popup);
    });
  }
  render() {
    return <div className="map-tooltip" />;
  }
}

const mapStateToProps = state => {
  return {
    selectionLevel: state.selectionLevel,
  };
};

export default withMap(connect(mapStateToProps)(MapTooltip));
