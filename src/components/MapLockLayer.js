import React, { Component } from 'react';
import { connect } from 'react-redux';
import { generateLockFilter } from '../util/map';

import { withMap } from './Context';

class MapHighlightLayer extends Component {
    render() {
        this.props.map.setFilter('districts-lock', generateLockFilter(this.props.lockedIds));
        return <div className="map-lock-layer" />;
    }
}

const mapStateToProps = (state, props) => {
    return {
        lockedIds: state.historyState.present.lockedIds,
    };
};

export default withMap(connect(mapStateToProps)(MapHighlightLayer));
