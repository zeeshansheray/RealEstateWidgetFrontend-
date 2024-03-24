import { Box, Slider } from '@material-ui/core';
import * as React from 'react';

export default function CustomSlider({value, marks, callback, keyName, min , max}) {

    console.log('value ', value)
  const handleChange = (event, newValue) => {
    callback(newValue, keyName);
  };

  return (
    <Box sx={{ width: '95%' }}>
      <Slider
        getAriaLabel = {() => 'Temperature range'}
        value        = {value}
        onChange     = {handleChange}
        marks        = {marks}
        max          = {max}
        min          = {min}
        step         = {null}
        sx           = {{
          '& .MuiSlider-rail': {
            backgroundColor: 'gray',
            height: '1px', // Set the background color of the slider bar to gray
          },
          '& .MuiSlider-track': {
            height: '1px',
            border: 0,
            opacity: 0.38,
            color: 'gray', // Set the color of the selected portion of the slider bar to gray
          },
          '& .MuiSlider-thumb': {
            color: 'white', // Set the color of the thumbs to white
          },
          '& .MuiSlider-markLabel':{
            fontSize  : 11,
            fontWeight: 500,
            fontFamily: 'Roboto Slab'
          }
        }}
      />
    </Box>
  );
}
