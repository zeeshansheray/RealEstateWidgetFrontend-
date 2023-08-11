import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../src/assets/css/global.scss'

function embedApp(containerId) {
  ReactDOM.render(<App />, document.getElementById(containerId || 'root'));
}

embedApp()