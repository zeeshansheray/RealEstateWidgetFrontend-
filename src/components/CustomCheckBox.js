import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ColorSchemeCode } from '../enums/ColorScheme';

const CustomFormControlLabel = makeStyles({
  root: {
      margin: 0
  },
  label: {
    fontSize  : '15px',                      //Body14R
    fontWeight: 400,                         //Body14R
    lineHeight: '16px',                      //Body14R
    fontFamily: 'Inter',                     //Body14R
    color     : ColorSchemeCode.neutral90,
    marginLeft: '10px'
  },
})

export default function CustomCheckBox({label, value, onChange, name, onClick, className, ...props}) {
    const classes = CustomFormControlLabel(props)

    return (
      <div id="CustomCheckBox">
        <FormControlLabel 
            className = {className}
            classes   = {classes}
            onClick   = {onClick}
            label     = {label}
            control   = {<Checkbox checked={value} onClick={onClick} onChange={onChange} name={name || label} />}
        />
      </div>
    );
}
