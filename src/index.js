import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { store } from './store'
import { Provider } from 'react-redux'

import App from './components/App';

const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, root
);