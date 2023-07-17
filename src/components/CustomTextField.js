import React, { useState } from "react";
import { ColorSchemeCode } from "../enums/ColorScheme";

export default function CustomTextField({ label, ...props }) {
  const [focus, setFocus] = useState(false);

  return (
    <div
      id="TextfieldUpdated"
      className={props.className + " position-relative"}
    >
      {label && (
        <label
          className="Body13M lh-16 mb_8 capitalize"
          style={{
            color: props.helperText
              ? ColorSchemeCode.danger30
              : focus
              ? ColorSchemeCode.primary50
              : ColorSchemeCode.neutral80,
            letterSpacing: 0.1,
            transition: "ease-in-out 0.2s",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        value={props.value || props.defaultValue}
        id={props.id ? props.id : "TextField_v1"}
        name={props.name}
        ref={props.inputRef}
        type={props.type ? props.type : "text"}
        onChange={props.onChange || props.onBlur}
        style={{
          fontSize:props.fontSize ? props.fontSize : "14px",
          lineHeight:"20px",
          fontWeight:"400",
          fontFamily:"Inter",
          color:ColorSchemeCode.neutral100,
          fontSmooting: "antialiased",
          padding: props.padding ? props.padding : "8px 8px 8px 16px",
          border: props.helperText && "1px solid " + ColorSchemeCode.danger30,
          paddingLeft: props.paddingLeft
            ? props.paddingLeft
            : props.position === "start"
            ? "32px"
            : "16px",
          background: props.background ? props.background: ColorSchemeCode.primary0,
        }}
        
        disabled={props.disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        autoComplete="on"
        placeholder={props.placeholder}
        onKeyUp={props.onKeyUp}
        inputProps={props.inputProps}
        className={props.className + " borderRadius-6"}
      ></input>
      {props.icon && props.position == "start" && (
        <div
          className={`position-absolute Body14R ${focus && "FocusedIcon"}`}
          style={{ left:props.left ? props.left: 16, top: props.top ? props.top : 32 }}
        >
          {props.icon}
        </div>
      )}
      {props.icon && props.position == "end" && (
        <div
          className={`position-absolute Body14R ${focus && "FocusedIcon"}`}
          style={{ right:props.right ? props.right: 16, top: props.top ? props.top : 32 }}
        >
          {props.icon}
        </div>
      )}
      {props.helperText && <div className="error">{props.helperText}</div>}
    </div>
  );
}
