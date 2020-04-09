import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

import './css/index.css';
import Builder from './Builder';
import About from './About';
import reducers from './reducers';

let store;

const persistConfig = {
	reducers,
	key: 'root',
	storage,
	stateReconciler: hardSet,
	blacklist: [
		'activatedIds',
		'geometry',
		'rectangleStartId',
		'hasActive',
		'activeCounty',
		'mapCountyName',
		'drawLimit',
		'spaceDown',
		'clickDown',
		'rectangleInProgress',
	],
};

const persistedReducer = persistReducer(persistConfig, reducers);

store = createStore(persistedReducer, compose(applyMiddleware(thunk)));

let persistor = persistStore(store);

const routing = (
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<Router>
				<div className="app">
					<Route exact path="/" component={Builder} />
					<Route path="/about" component={About} />
				</div>
			</Router>
		</PersistGate>
	</Provider>
);
ReactDOM.render(routing, document.getElementById('root'));
