import * as React from "react";
import { Autocomplete } from "@material-ui/lab";
import { capitalize, styled, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ColorSchemeCode } from "../enums/ColorScheme";


const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color      : ColorSchemeCode.themeColor,
    fontSize   : '14px',                       //Link14M
    fontWeight : '500',                        //Link14M
    lineHeight : '16px',                       //Link14M
    fontFamily : 'Inter',                    //Link14M
    textTransform: 'capitalize',
  },
  '& .MuiInputAdornment-root':{
    zIndex: 1
  },
  '& .MuiInputAdornment-positionStart':{
    zIndex: 1
  },
  '& .MuiOutlinedInput-input':{
    zIndex: 1,
    textTransform: 'capitalize'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: ColorSchemeCode.themeColor,
  },
  '& .MuiOutlinedInput-root': {
    // font
    caretColor     : ColorSchemeCode.themeColor,
    fontSize       : '14px',                       //Body14R
    fontWeight     : '400',                        //Body14R
    lineHeight     : '16px',                       //Body14R
    fontFamily     : 'Inter',
    textTransform  : 'capitalize',                 //Body14R
    color          : ColorSchemeCode.Heading,
    backgroundColor: '#F2F6FF',

    height: props=>props.height || '36px',
    '& fieldset': {
      borderColor     : ColorSchemeCode.neutral20,
      backgroundColor : ColorSchemeCode.GeneralWhite
    },
    '&:hover fieldset': {
      borderColor: ColorSchemeCode.primary50,
    },
    '&.Mui-focused fieldset': {
      border: '1px solid '+ColorSchemeCode.primary50,
    },
  },
});

const useStylesLabelElement = makeStyles(() => ({
  root: {
    // paddingLeft: '0px !important',
    fontSize   : '14px',                    //Body14R
    fontWeight : '400',                     //Body14R
    lineHeight : '16px',                    //Body14R
    fontFamily : 'Inter',                 //Body14R
    color      : ColorSchemeCode.Paragraph,
    textTransform: 'capitalize',
    backgroundColor : ColorSchemeCode.primary0
    
  }
}));

export default function CustomGroupedSelect({list, onChange, value, label}) {
  const options = list.map((option) => {
    return {
      ...option
    };
  });

  const useStyles = makeStyles(() => ({
    autoComplete: {
      fontSize  : "15px",
      lineHeight: '16px',
      color     : '#202124',
      textTransform: 'capitalize'
    },
    option: {
      fontSize: "15px",
      lineHeight: '16px',
      color     : '#202124',
      textTransform: 'capitalize',
      zIndex : 99999
    },
  }));

  const classes      = useStyles();
  const labelClasses = useStylesLabelElement();

  return (
    <Autocomplete
      classes={{ input: classes.autoComplete + labelClasses, option: classes.option }}
      id="grouped-demo"
      options={options.sort(
        (a, b) => - b.category.localeCompare(a.category)
      )}
      groupBy        = {(option) => option.category}
      getOptionLabel = {(option) => option.subcategory}
      value          = {value}
      className      = "capitalize"
      onChange       = {onChange}
      openOnFocus    = {true}
      size           = "small"
      placeholder    = "Select"
      renderInput    = {(params) => (
        <div>
          <div className='Body13R color-Paragraph mb_8'>
            {label}
          </div>
          <CustomTextField 
            size               = "small"
            variant            = "outlined"
            className          = "capitalize"
            textCapitalization = {'sentences'}
            placeholder        = "Select"
            {...params}  
          />
        </div>
      )}
    />
  );
}
