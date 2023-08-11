// widget.js

// Define a function to initialize the CounterWidget
function initCounterWidget(containerId) {
    const container = document.getElementById(containerId) || document.createElement('div');
  
    if (!document.getElementById(containerId)) {
      document.body.appendChild(container);
    }
  
    // Load the widget's built JavaScript and CSS files
    const script = document.createElement('script');
    script.src = './build/static/js/main.0cb646c2.js'; // Replace with your actual path
    document.head.appendChild(script);
  
    // Wait for the script to load
    script.onload = () => {
      // At this point, the CounterWidget initialization function should be available
      initWidgetComponent(container); // Call the function to initialize the widget
    };
  }
  
  // Placeholder function for initializing the CounterWidget component
  function initWidgetComponent(container) {
    // This function should be defined in your main.eaafacdb.js file
    // It initializes the CounterWidget and renders it in the specified container
    // For example: initCounterWidget(container);
  }
  
  window.initCounterWidget = initCounterWidget;
  