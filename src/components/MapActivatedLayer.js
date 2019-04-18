import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withMap } from './Context';

class MapActivatedLayer extends Component {
  componentDidUpdate() {
    // const { activatedIds } = this.props;
    // const expression = ['in', 'id'].concat(
    //   activatedIds.map(function(id) {
    //     return id;
    //   })
    // );
    // this.props.map.setFilter('hover-fill', expression);
  }
  render() {
    return <div className="map-activated-layer" />;
  }
}

const mapStateToProps = (state, props) => {
  return {
    // activatedIds: state.activatedIds,
  };
};

export default withMap(connect(mapStateToProps)(MapActivatedLayer));
