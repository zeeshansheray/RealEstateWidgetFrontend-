/*

-   Google Maps
-   Documentation: https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript

*/

import React, { useState, useRef, useEffect } from 'react'

let Map
let Marker

function loadMap({GoogleMapRef, position, draggable, dragEnd, zoom}) {
    let defaultPosition = {lat: -34.397, lng: 150.644}, 
        defaultZoom = 8
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(position => defaultPosition = { lat: position.coords.latitude, lng: position.coords.longitude })
    
    Map = new window.google.maps.Map(GoogleMapRef.current, {
        center : position || defaultPosition,
        zoom   : zoom || defaultZoom
    })
    Marker = new window.google.maps.Marker({
        position  : position || defaultPosition,
        draggable : draggable,
        Map,
    })

    Marker.addListener("dragend", dragEnd)

}

function GoogleMap({className, width, height, zoom, draggable, position, dragEnd}) {
    const GoogleMapRef   = useRef(null)
    const [statePosition, setStatePosition] = useState({lat: '', lng: ''})

    const onLoad = () => {
        // Checking state updates
        if(JSON.stringify(statePosition) === JSON.stringify(position)) return

        setStatePosition({...position})
        loadMap({
            draggable, 
            GoogleMapRef, 
            position, 
            dragEnd, 
            zoom
        })
        
    }

    useEffect(onLoad, [position])

    return <div tabIndex="-1" className={className + " m_0 p_0"} style={{width, height}} ref={GoogleMapRef}></div>
}

export default GoogleMap
