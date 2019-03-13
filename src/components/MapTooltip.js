import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapboxGL from 'mapbox-gl';

import { withMap } from './Context';
import { numberWithCommas } from '../util/data';

class MapTooltip extends Component {
  state = {
    hover: false,
    isDrawing: false,
  };
  componentDidMount() {
    this.popup = new MapboxGL.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [10, 10],
      anchor: 'top-left',
    }).addTo(this.props.map);
    this.setEvents();
    this.setBodyClass();
    this.props.map.on('draw.create', () => {
      this.setState({ isDrawing: false });
    });
    this.props.map.on('draw.start', () => {
      this.setState({ isDrawing: true });
    });
    this.props.map.on('mousemove', e => {
      this.props.popup === 'compact' && this.popup.setLngLat(e.lngLat);
    });
    this.popup.setLngLat([0, 0]);
  }
  setBodyClass = () => {
    document.body.className = '';
    document.body.classList.add(`popup-style-${this.props.popup}`);
  };
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
    this.setState({ feature: e.features[0], hover: true });
  };
  onMouseLeave = e => {
    this.setState({ hover: false });
  };

  rectFollowHtml = () => {
    let popTotal = {
      number: 0,
      race: [
        { name: 'white', number: 0 },
        { name: 'black', number: 0 },
        { name: 'asian', number: 0 },
        { name: 'native', number: 0 },
        { name: 'other', number: 0 },
      ],
    };
    this.props.activeIds.forEach(id => {
      const geounit = window.dataFeatures[id];
      popTotal.number += geounit.population;
      popTotal.race.forEach(population => {
        population.number += geounit[population.name];
      });
    });
    let chart = '';
    if (popTotal.number > 0) {
      popTotal.race.forEach((population, index) => {
        chart += `<div class="demographic demographic-${index}" style="width: ${(population.number /
          popTotal.number) *
          100}%"></div>`;
      });
    } else {
      chart += '<div class="demographic demographic-none"></div>';
    }
    const html = `
          <div class="count">${numberWithCommas(this.props.activeIds.length)} units</div>
          <div class="population">${numberWithCommas(popTotal.number)}</div>
          <div class="chart">
            <div class="demographics">
              ${chart}
            </div>
          </div>
        `;
    return html;
  };

  rectFixedHtml = () => {
    let popTotal = {
      number: 0,
      race: [
        { name: 'white', number: 0, percent: undefined },
        { name: 'black', number: 0, percent: undefined },
        { name: 'asian', number: 0, percent: undefined },
        { name: 'native', number: 0, percent: undefined },
        { name: 'other', number: 0, percent: undefined },
      ],
    };
    this.props.activeIds.forEach(id => {
      const geounit = window.dataFeatures[id];
      popTotal.number += geounit.population;
      popTotal.race.forEach(population => {
        population.number += geounit[population.name];
      });
    });

    popTotal.race.forEach(population => {
      population.percent = (population.number / popTotal.number) * 100;
    });

    let html = '';
    if (popTotal.number > 0) {
      html += `
        <div class="fixed-title">${numberWithCommas(this.props.activeIds.length)} units</div>
        <table class="table">
          <tr>
            <td>Total</td>
            <td class="table-number">${numberWithCommas(popTotal.number)}</td>
            <td class="table-number">—</td>
          </tr>
          <tr>
            <td>White</td>
            <td class="table-number">${numberWithCommas(popTotal.race[0].number)}</td>
            <td class="table-number">${Math.round(popTotal.race[0].percent)}%</td>
          </tr>
          <tr>
            <td>Black</td>
            <td class="table-number">${numberWithCommas(popTotal.race[1].number)}</td>
            <td class="table-number">${Math.round(popTotal.race[1].percent)}%</td>
          </tr>
          <tr>
            <td>Asian</td>
            <td class="table-number">${numberWithCommas(popTotal.race[2].number)}</td>
            <td class="table-number">${Math.round(popTotal.race[2].percent)}%</td>
          </tr>
          <tr>
            <td>Native</td>
            <td class="table-number">${numberWithCommas(popTotal.race[3].number)}</td>
            <td class="table-number">${Math.round(popTotal.race[3].percent)}%</td>
          </tr>
          <tr>
            <td>Other</td>
            <td class="table-number">${numberWithCommas(popTotal.race[4].number)}</td>
            <td class="table-number">${Math.round(popTotal.race[4].percent)}%</td>
          </tr>
        </table>
        `;
    } else {
      html += '<div class="popup-zero-population">Draw a rectangle to select</div>';
    }
    return html;
  };

  pointerFollowHtml = () => {
    const properties = this.state.feature.properties;
    const popTotal = properties.population;
    const popWhite = properties.white;
    const popWhitePercent = (popWhite / properties.population) * 100;
    const popBlack = properties.black;
    const popBlackPercent = (popBlack / properties.population) * 100;
    const popAsian = properties.asian;
    const popAsianPercent = (popAsian / properties.population) * 100;
    const popNative = properties.native;
    const popNativePercent = (popNative / properties.population) * 100;
    const popOther = properties.other;
    const popOtherPercent = (popOther / properties.population) * 100;
    let html = '';
    if (properties.population > 0) {
      html += `
        <div class="population">${numberWithCommas(popTotal)}</div>
        <div class="chart">
          <div class="demographics">
            <div class="demographic demographic-0" style="width: ${popWhitePercent}%"></div>
            <div class="demographic demographic-1" style="width: ${popBlackPercent}%"></div>
            <div class="demographic demographic-2" style="width: ${popAsianPercent}%"></div>
            <div class="demographic demographic-3" style="width: ${popNativePercent}%"></div>
            <div class="demographic demographic-4" style="width: ${popOtherPercent}%"></div>
          </div>
        </div>
        `;
    } else {
      html += '<div class="popup-zero-population">This area has zero population</div>';
    }
    return html;
  };

  pointerFixedHtml = () => {
    const properties = this.state.feature.properties;
    const popTotal = properties.population;
    const popWhite = properties.white;
    const popWhitePercent = (popWhite / properties.population) * 100;
    const popBlack = properties.black;
    const popBlackPercent = (popBlack / properties.population) * 100;
    const popAsian = properties.asian;
    const popAsianPercent = (popAsian / properties.population) * 100;
    const popNative = properties.native;
    const popNativePercent = (popNative / properties.population) * 100;
    const popOther = properties.other;
    const popOtherPercent = (popOther / properties.population) * 100;
    let html = '';
    if (this.props.selectionLevel === 'county') {
      html += `<div class="fixed-title">${properties.name} County</div>`;
    } else {
      html += `<div class="fixed-title">BG #${properties.id}</div>`;
    }
    if (properties.population > 0) {
      html += `
        <table class="table">
          <tr>
            <td>Total</td>
            <td class="table-number">${numberWithCommas(popTotal)}</td>
            <td class="table-number">—</td>
          </tr>
          <tr>
            <td>White</td>
            <td class="table-number">${numberWithCommas(popWhite)}</td>
            <td class="table-number">${Math.round(popWhitePercent)}%</td>
          </tr>
          <tr>
            <td>Black</td>
            <td class="table-number">${numberWithCommas(popBlack)}</td>
            <td class="table-number">${Math.round(popBlackPercent)}%</td>
          </tr>
          <tr>
            <td>Asian</td>
            <td class="table-number">${numberWithCommas(popAsian)}</td>
            <td class="table-number">${Math.round(popAsianPercent)}%</td>
          </tr>
          <tr>
            <td>Native</td>
            <td class="table-number">${numberWithCommas(popNative)}</td>
            <td class="table-number">${Math.round(popNativePercent)}%</td>
          </tr>
          <tr>
            <td>Other</td>
            <td class="table-number">${numberWithCommas(popOther)}</td>
            <td class="table-number">${Math.round(popOtherPercent)}%</td>
          </tr>
        </table>
        `;
    } else {
      html += '<div class="popup-zero-population">This area has zero population</div>';
    }
    return html;
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state &&
      this.state.feature &&
      nextState.feature.id === this.state.feature.id &&
      nextState.hover === this.state.hover &&
      nextState.isDrawing === this.state.isDrawing &&
      nextProps.selectionLevel === this.props.selectionLevel &&
      nextProps.drawMode === this.props.drawMode &&
      nextProps.popup === this.props.popup &&
      nextProps.activeIds.length === this.props.activeIds.length
    ) {
      return false;
    } else {
      return true;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectionLevel !== this.props.selectionLevel) {
      this.setEvents();
    }
    if (prevProps.popup !== this.props.popup) {
      this.setBodyClass();
    }
    if (this.state.feature && this.props.popup !== 'none') {
      let html = '';
      this.showPopup = this.state.isDrawing || this.state.hover;
      if (this.state.isDrawing) {
        html = this.props.popup === 'compact' ? this.rectFollowHtml() : this.rectFixedHtml();
      } else {
        html = this.props.popup === 'compact' ? this.pointerFollowHtml() : this.pointerFixedHtml();
      }
      this.popup.setHTML(
        `<div class="popup-content-container" style="display: ${
          this.showPopup ? 'block' : 'none'
        }">${html}</div>`
      );
    }
  }
  render() {
    return <div className="map-tooltip" />;
  }
}

const mapStateToProps = state => {
  return {
    selectionLevel: state.selectionLevel,
    drawMode: state.drawMode,
    popup: state.popup,
    activeIds: state.activatedIds,
    hasActive: state.hasActive,
  };
};

export default withMap(connect(mapStateToProps)(MapTooltip));
