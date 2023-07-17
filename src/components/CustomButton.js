import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ColorSchemeCode } from "../enums/ColorScheme";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((props) => ({
  root: {
    backgroundColor: (props) =>
      props.varient == "tertiary"
        ? "transparent"
        : props.varient === "dangerPrimary"
        ? ColorSchemeCode.danger30
        : props.varient === "dangerSecondary"
        ? ColorSchemeCode.white
        : props.varient === "dangerTertiary"
        ? ColorSchemeCode.white
        : props.varient === "tertiary"
        ? ColorSchemeCode.white
        : props.varient === "secondary"
        ? "transparent"
        : props.varient === "primary"
        ? ColorSchemeCode.primary50
        : props.varient === "warning"
        ? ColorSchemeCode.danger30
        : props.varient === "warningSecondary"
        ? ColorSchemeCode.white
        : ColorSchemeCode.primary50,
    borderRadius: "3px",
    boxShadow: (props) =>
      props.varient == "primary"
        ? "0px 1px 2px rgba(15, 15, 15, 0.1), inset 0px 0px 1px rgba(15, 15, 15, 0.1)"
        : "none",
    outline: (props) =>
      props.varient == "secondary"
        ? "1px solid " + ColorSchemeCode.neutral20
        : props.varient == "dangerPrimary"
        ? "1px solid " + ColorSchemeCode.neutral20
        : props.varient === "warningSecondary"
        ? "1px solid " + ColorSchemeCode.neutral20
        : "1px solid transparent",
    padding: (props) =>
      props.size === "xl"
        ? "16px 16px"
        : props.size === "l"
        ? "12px 16px"
        : props.size === "s"
        ? "6px 16px"
        : "8px 16px",
    color: (props) =>
      props.varient === "dangerPrimary"
        ? ColorSchemeCode.primary0
        : props.varient === "dangerSecondary"
        ? ColorSchemeCode.danger30
        : props.varient === "dangerTertiary"
        ? ColorSchemeCode.danger30
        : props.varient === "tertiary"
        ? ColorSchemeCode.primary50
        : props.varient === "secondary"
        ? ColorSchemeCode.primary50
        : props.varient === "primary"
        ? ColorSchemeCode.primary0
        : props.varient === "warning"
        ? ColorSchemeCode.white
        : props.varient === "warningSecondary"
        ? ColorSchemeCode.danger30
        : ColorSchemeCode.primary0,
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: (props) =>
        props.varient === "dangerPrimary"
          ? ColorSchemeCode.danger40
          : props.varient === "dangerSecondary"
          ? ColorSchemeCode.danger0
          : props.varient === "dangerTertiary"
          ? ColorSchemeCode.danger0
          : props.varient === "tertiary"
          ? ColorSchemeCode.primary0
          : props.varient === "secondary"
          ? ColorSchemeCode.primary0
          : props.varient === "primary"
          ? ColorSchemeCode.primary60
          : props.varient === "warning"
          ? ColorSchemeCode.danger20
          : props.varient === "warningSecondary"
          ? ColorSchemeCode.danger0
          : ColorSchemeCode.primary60,
      color: (props) =>
        props.varient === "dangerPrimary"
          ? ColorSchemeCode.primary0
          : props.varient === "dangerSecondary"
          ? ColorSchemeCode.danger30
          : props.varient === "dangerTertiary"
          ? ColorSchemeCode.danger30
          : props.varient === "tertiary"
          ? ColorSchemeCode.primary50
          : props.varient === "secondary"
          ? ColorSchemeCode.primary50
          : props.varient === "primary"
          ? ColorSchemeCode.primary0
          : props.varient === "warning"
          ? ColorSchemeCode.white
          : props.varient === "warningSecondary"
          ? ColorSchemeCode.danger40
          : ColorSchemeCode.primary0,
      outline: (props) =>
        props.varient === "secondary"
          ? "1px solid" + ColorSchemeCode.primary50
          : props.varient == "dangerSecondary"
          ? "1px solid " + ColorSchemeCode.danger30
          : props.varient === "warningSecondary"
        ? "1px solid " + ColorSchemeCode.danger40
          : "1px solid transparent",
      boxShadow: "none",
    },
    "&:focus": {
      backgroundColor: (props) =>
        props.varient === "dangerPrimary"
          ? ColorSchemeCode.danger50
          : props.varient === "dangerSecondary"
          ? ColorSchemeCode.danger10
          : props.varient === "dangerTertiary"
          ? ColorSchemeCode.danger10
          : props.varient === "tertiary"
          ? ColorSchemeCode.primary10
          : props.varient === "secondary"
          ? ColorSchemeCode.primary10
          : props.varient === "primary"
          ? ColorSchemeCode.primary70
          : props.varient === "warning"
          ? ColorSchemeCode.ButtonWarningPressedText
          : props.varient === "warningSecondary"
          ? ColorSchemeCode.danger10
          : ColorSchemeCode.primary70,
      color: (props) =>
        props.varient === "dangerPrimary"
          ? ColorSchemeCode.primary0
          : props.varient === "dangerSecondary"
          ? ColorSchemeCode.danger60
          : props.varient === "dangerTertiary"
          ? ColorSchemeCode.danger50
          : props.varient === "tertiary"
          ? ColorSchemeCode.primary70
          : props.varient === "secondary"
          ? ColorSchemeCode.primary70
          : props.varient === "primary"
          ? ColorSchemeCode.primary0
          : props.varient === "warning"
          ? ColorSchemeCode.primary0
          : props.varient === "warningSecondary"
          ? ColorSchemeCode.danger50
          : ColorSchemeCode.white,
      outline: (props) =>
        props.varient === "secondary"
          ? "2px solid" + ColorSchemeCode.danger50
          : props.varient == "dangerSecondary"
          ? ColorSchemeCode.danger50
          : props.varient === "warningSecondary"
          ? "1px solid " + ColorSchemeCode.danger50
          : "1px solid transparent",
    },
  },
}));

export default function CustomButton({
  backgroundColor,
  color,
  className,
  onClick,
  disabled,
  btntext,
  icon,
  ...props
}) {
  const propsObj = {
    className: className,
  };
  const classes = useStyles({ ...props });
  const customClass = propsObj.className;

  delete propsObj.className;

  return (
    <Button
      {...propsObj}
      onClick={onClick}
      variant="contained"
      color={color}
      disabled={disabled}
      className={
        "U14M " +
        (props.varient === "secondary"
          ? classes.root + " secondary " + customClass
          : props.varient === "primary"
          ? classes.root + " customButton " + customClass
          : props.varient === "warning"
          ? classes.root + " warning " + customClass
          : props.varient === "warningSecondary"
          ? classes.root + " warningSecondary " + customClass
          : classes.root + " customButton " + customClass)
      }
    >
      {icon ? (
        <>
          <div className="d-flex">{icon} </div>
          {btntext != "" && <div className="ml_6">{btntext}</div>}
        </>
      ) : (
        <div> {btntext} </div>
      )}
    </Button>
  );
}
