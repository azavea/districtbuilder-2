import React from 'react';

export const MapContext = React.createContext();

export const withMap = Component => {
    return function ConnectedComponent(props) {
        return (
            <MapContext.Consumer>{map => <Component {...props} map={map} />}</MapContext.Consumer>
        );
    };
};
