import App from "./src/App";

// Load React and ReactDOM from a CDN
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js';
document.head.appendChild(script);

const script2 = document.createElement('script');
script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js';
document.head.appendChild(script2);

// Function to load and render the React app
function loadReactApp(containerId) {
  // Create a container for the app
  const container = document.getElementById(containerId);

  // Render your React app into the container
  ReactDOM.render(React.createElement(App), container);
}

// Expose the loadReactApp function globally
window.loadReactApp = loadReactApp;
