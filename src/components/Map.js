import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import memoize from 'memoizee';
import './mapbox-gl.css';

import { drawMapLayers, updateDistricts, updateHighlight } from '../util';
import { clickGeounit } from '../actions';

mapboxgl.accessToken = 'pk.eyJ1IjoibGtuYXJmIiwiYSI6IjhjbGg4RUkifQ.-lS6mAkmR3SVh-W4XwQElg';

class Map extends Component {
    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: {
                version: 8,
                name: 'Empty',
                sources: {},
                layers: [],
                glyphs:
                    window.location.origin +
                    window.location.pathname +
                    '/data/fonts/{fontstack}/{range}.pbf',
            },
            // style: 'mapbox://styles/lknarf/cjp47wo3z15si2sk3f7mla7zz',
            center: [-78.037, 40.031],
            zoom: 6,
        });

        this.map.doubleClickZoom.disable();

        this.map.on('click', 'blockgroups-fill', e => {
            this.props.onClickGeounit(e);
        });

        this.map.on('mousemove', 'blockgroups-fill', e => {
            this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', 'blockgroups-fill', e => {
            this.map.getCanvas().style.cursor = '';
        });

        this.map.on('load', () => {
            this.onMapLoad();
        });
    }

    onMapLoad() {
        drawMapLayers(this.map);
        // this.forceUpdate();
    }

    updateHighlightMemoized = memoize(updateHighlight, {
        max: 1,
        limit: 1,
        primitive: true,
    });

    updateDistrictsMemomized = memoize(updateDistricts, {
        max: 2,
        limit: 1,
        primitive: true,
    });

    render() {
        // TODO: Figure out if there is a better way to handle data not being loaded than using if statements like this
        if (this.props.topoJSON && this.props.assignedDistricts) {
            this.updateDistrictsMemomized(
                this.props.assignedDistricts,
                this.props.topoJSON,
                this.map
            );
        }
        if (this.props.topoJSON && this.props.selectedIds) {
            this.updateHighlightMemoized(this.props.selectedIds, this.props.topoJSON, this.map);
        }

        return (
            <div>
                <div ref={el => (this.mapContainer = el)} className="map" />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        selectedIds: state.selectedIds,
        topoJSON: state.topoJSON,
        geometries: state.geometries,
        selectedDistrict: state.selectedDistrict,
        assignedDistricts: state.assignedDistricts,
    };
};

const mapActionsToProps = {
    onClickGeounit: clickGeounit,
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Map);
