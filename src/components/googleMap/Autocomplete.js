/*

-   Google Maps
-   Documentation: https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript

*/

import React, { useState, useRef, useEffect } from 'react'

import { utils } from '../../utils'

import CustomTextField from '../CustomTextField'

let autoComplete
let autoCompleteListener

function loadAutocomplete(autoCompleteRef) {
    autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current)
    autoComplete.setFields(["address_components", "geometry", "formatted_address", "utc_offset_minutes"])
}

function updateListener({getPlace, locationSummary}){
    autoCompleteListener && window.google.maps.event.removeListener(autoCompleteListener)
    autoCompleteListener = autoComplete.addListener("place_changed", () => {
        getPlace && getPlace(autoComplete.getPlace())
        locationSummary && locationSummary(utils.summarisedLocation(autoComplete.getPlace()))
    })
}


function Autocomplete({getPlace, locationSummary, value, onChange, ...props}) {
    
    const autoCompleteRef   = useRef(null)

    const onLoad = () => loadAutocomplete(autoCompleteRef)
    const onUpdate = () => updateListener({getPlace, locationSummary})

    useEffect(onLoad, [])
    useEffect(onUpdate, [value])



    return (
        <CustomTextField 
            value    = {value}
            inputRef = {autoCompleteRef}
            onChange = {onChange}
            {...props}
        />
    )
}

export default Autocomplete
