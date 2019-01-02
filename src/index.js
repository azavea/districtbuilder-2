import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import thunk from 'redux-thunk';

import './css/index.css';
import Builder from './Builder';
import About from './About';
import reducers from './reducers';

const store = createStore(
	reducers,
	compose(
		applyMiddleware(thunk)
		// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

const routing = (
	<Provider store={store}>
		<Router>
			<div className="app">
				<Route exact path="/" component={Builder} />
				<Route path="/about" component={About} />
			</div>
		</Router>
	</Provider>
);
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
