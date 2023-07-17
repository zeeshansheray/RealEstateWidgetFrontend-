import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ColorSchemeCode } from '../enums/ColorScheme';

const CustomFormControlLabel = makeStyles({
    root: {
        margin: 0
    },
    label: {
      fontFamily   : 'Inter',
      fontStyle    : 'normal',
      fontWeight   : '600',
      fontSize     : '13px',
      lineHeight   : '22px',
      letterSpacing: '0.1px',
      color        : ColorSchemeCode.neutral100
    },
})


export default function CustomRadio({value, label, styles, checked, className}) {
    const classes = CustomFormControlLabel(styles)
    return(
      <div id="CustomRadio" className="d-flex flex-column">
        <FormControlLabel 
          classes = {classes +" Body14R " +className}
          value   = {value}
          label   = {label}
          control = {<Radio checked={checked}/>}
        />
      </div>
    )
}