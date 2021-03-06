import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
// import store from './store';
import amos from './redux/store'
import axios from 'axios';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// axios.defaults.baseURL = 'http://127.0.0.1:5000';

ReactDOM.render(
  <Provider store={amos}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
