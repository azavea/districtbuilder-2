import React, { Component } from 'react';

export class DistrictColorSymbol extends Component {
    render() {
        const myStyle = { background: this.props.color };

        return <div className="district-color-symbol" style={myStyle} />;
    }
}
