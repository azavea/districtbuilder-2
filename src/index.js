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

const persistConfig = {
	key: 'root',
	storage,
	stateReconciler: hardSet,
	whitelist: [
		'historyState',
		'optionDrawCountyLimit',
		'optionDrawUnassigned',
		'mapLabels',
		'mapBasemap',
		'drawMode',
		'selectionLevel',
	],
};

const persistedReducer = persistReducer(persistConfig, reducers);

let store;

if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
	store = createStore(
		persistedReducer,
		compose(
			applyMiddleware(thunk),
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		)
	);
} else {
	store = createStore(persistedReducer, compose(applyMiddleware(thunk)));
}

let persistor = persistStore(store);

const routing = (
	<Provider store={store}>
		<Router>
			<PersistGate loading={null} persistor={persistor}>
				<div className="app">
					<Route exact path="/" component={Builder} />
					<Route path="/about" component={About} />
				</div>
			</PersistGate>
		</Router>
	</Provider>
);
ReactDOM.render(routing, document.getElementById('root'));
