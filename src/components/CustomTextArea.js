import React, {useState} from 'react'
import { ColorSchemeCode } from '../enums/ColorScheme';

export default function CustomTextArea({label, ...props}) {

  const [focus, setFocus] = useState(false);

  return (
      <div id="TextfieldUpdated" className='position-relative'>
        <div className="d-flex space-between">
          <label className='Body13M fs-14 fw-5 control-label' style={{color: props.helperText ? ColorSchemeCode.danger30 : focus ? ColorSchemeCode.primary50 : ColorSchemeCode.neutral80, letterSpacing : 0.1,transition:'ease-in-out 0.2s'}}>{label}</label>
        </div>
        <textarea 
            className   = {props.className + ' borderRadius-6'}
            value       = {props.value || props.defaultValue}
            id          = "TextArea_v1"
            rows        = {props.rows ? props.rows : "4"}
            name        = {props.name}
            placeholder = {props.placeholder||''}
            cols        = "50"
            type        = "text"
            onChange    = {props.onChange || props.onBlur}
            style       = {{padding : props.position == 'start' ? '8px 16px 8px 32px' : props.position == 'end' ? '8px 32px 8px 16px' : '10px 16px' , fontSize: '14px', lineHeight: '20px', border : props.helperText && ('1px solid ' + ColorSchemeCode.danger30), background : props.helperText && (ColorSchemeCode.danger0) }}
            disabled    = {props.disabled}
            onFocus     = {()=>setFocus(true)}
            onBlur      = {()=>setFocus(false)}
            
        >
        </textarea>
        {(props.icon && props.position == 'start') && <div className={`position-absolute ${focus && 'FocusedIcon'}`} style={{left : 16, top: 35}}>{props.icon}</div>}
        {(props.icon && props.position == 'end') && <div className={`position-absolute ${focus && 'FocusedIcon'}`} style={{right : 16, top: 35}}>{props.icon}</div>}
        {props.helperText && <div className='error'>{props.helperText}</div>}
      </div>
  )
}
