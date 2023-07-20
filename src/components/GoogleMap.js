// import React, { useEffect, useRef } from 'react';

// const MapComponent = ({ data, onClickTile }) => {
//   const mapRef = useRef(null);
//   const infoWindowRef = useRef(new window.google.maps.InfoWindow());

//   useEffect(() => {
//     // Load the Google Maps API
//     const loadMapScript = () => {
//       const script = document.createElement('script');
//       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUUEUoLYKBnVKGvVjLchBzdMR-CUa5A4&libraries=places`;
//       script.async = true;
//       script.onload = initMap;
//       document.head.appendChild(script);
//     };

//     const blackMarkerIcon = {
//         url: 'https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-Picture.png',
//         scaledSize: new window.google.maps.Size(24, 24), // Adjust the size as needed
//       };

//     // Initialize the map
//     const initMap = () => {
//       const mapOptions = {
//         center: { lat: data[0].latitude, lng: data[0].longitude }, // Set the initial map center
//         zoom: 8, // Set the initial zoom level
//       };

//       // Create the map instance
//       const map = new window.google.maps.Map(mapRef.current, mapOptions);

//       // Add markers for each data item
//       data.forEach((item) => {
//         const marker = new window.google.maps.Marker({
//           position: { lat: item.latitude, lng: item.longitude },
//           map,
//           icon: blackMarkerIcon,
//         });

//         marker.addListener('mouseover', () => {
//             const infoWindow = infoWindowRef.current;
//             infoWindow.setContent(item.name); // Set the content of the info window, you can customize this as needed
//             infoWindow.open(map, marker);
//           });
  
//           marker.addListener('mouseout', () => {
//             infoWindowRef.current.close();
//           });

//       });
//     };

//     loadMapScript();

//     // Clean up the map script when the component is unmounted
//     return () => {
//       const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
//       if (script) {
//         script.remove();
//       }
//     };
//   }, [data]);

//   return (
//     <div id="map" ref={mapRef} style={{ width: '100%', height: '400px' }}>
//       {/* The map will be rendered inside this div */}
//     </div>
//   );
// };

// export default MapComponent;
