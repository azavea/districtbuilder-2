import React, { Component } from 'react';
import { connect } from 'react-redux';

import { lockDistrict } from '../actions';

class LockButton extends Component {
    render() {
        return (
            <button
                className={'button-lock ' + this.props.lockedStatus}
                onClick={e => this.onLockDistrict(e, this.props.index)}
                data-rh="Lock district"
            >
                <i className={'icon-lock' + this.props.lockedStatus} />
            </button>
        );
    }

    onLockDistrict = (e, index) => {
        e.stopPropagation();
        this.props.onLockDistrict(index);
    };
}

const mapActionsToProps = {
    onLockDistrict: lockDistrict,
};

export default connect(
    null,
    mapActionsToProps
)(LockButton);
