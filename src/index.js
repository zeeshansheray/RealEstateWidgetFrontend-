import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../src/assets/css/global.scss'

export function embedApp(containerId) {
  console.log('containerId ',containerId)
  ReactDOM.render(<App />, document.getElementById(containerId || 'root'));
}

embedApp('my-embed-container')