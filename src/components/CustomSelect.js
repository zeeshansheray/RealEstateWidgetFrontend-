import React, {useState} from 'react'
import { ColorSchemeCode } from '../enums/ColorScheme';
import SvgIcons from '../icons/svg.icon'

export default function CustomSelect({label, ...props}) {

  const [focus, setFocus] = useState(false);

  return (
      <div id="SelectUpdated" className='position-relative'>
        <label className='Body13M mb_8 lh-16 fw-5 control-label' style={{color: props.helperText ? ColorSchemeCode.danger30 : focus ? ColorSchemeCode.primary50 : ColorSchemeCode.neutral80, letterSpacing : 0.1,transition:'ease-in-out 0.2s'}}>{label}</label>
        <select 
            className   = {props.className + ' Body14R borderRadius-6'}
            value       = {props.value || props.defaultValue}
            onChange    = {props.onChange}
            disabled    = {props.disabled}
            name        = {props.name}
            onFocus     = {()=>setFocus(true)}
            onBlur      = {()=>setFocus(false)}
        > 
           <option className=' Body14R fs-14 color-neutral100' value={""} hidden>
                {`Select ${props.placeholder ? props.placeholder : ""} `}
           </option>
           {props.options}
        </select>
        {props.helperText && <div className="d-flex error"><SvgIcons.HelperTextIcon/><div className="ml_8">{props.helperText}</div></div>}
      </div>
  )
}



