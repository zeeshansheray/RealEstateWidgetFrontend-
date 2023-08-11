import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../src/assets/css/global.scss'

export function embedApp(containerId) {
  ReactDOM.render(<App />, document.getElementById(containerId || 'root'));
}

embedApp()