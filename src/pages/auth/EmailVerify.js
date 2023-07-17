import React, { useContext, useState, useEffect } from "react";
import localforage, * as localForage from "localforage";

import CircularProgress from "@material-ui/core/CircularProgress";

import CustomButton from "../../components/CustomButton";
import CustomTextField from "../../components/CustomTextField";
import VerificationCode from "../../components/VerificationCode";

import PngIcons from "../../icons/png.icon";
import { utils } from "../../utils";
import { LayoutContext } from '../../context/layout.context';
import { replace, useFormik } from "formik";
import { AuthVld } from "../../validation";
import { SvgIcons } from "../../icons";
import AuthService from "../../services/Auth";
import { useNavigate } from "react-router-dom";

export default function EmailVerify() {

  const [state, setState] = React.useState({
    loader     : false,
    apiError   : "",
    apiResponse: "",
    code       : "",
    valid      : false,
    codeMatched: false,
    success    : false,
  });

  const layout = useContext(LayoutContext);
  const navigate = useNavigate();

  useEffect(() => {
      layout.setLayout({
        showNav : false,
        showFooter: false,
      })
  }, []);


  const [type, settype] = useState("text");

  const eyeClick = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      settype("password");
    } else {
      x.type = "password";
      settype("text");
    }
  };

  const handleCode = (code) => setState({ ...state, code, valid: true });
  const Validate = (valid) => setState({ ...state, valid });

  console.log('formik ', state);

  const initValues = {
    password: ""
  }

  const formik = useFormik({
    initialValues : initValues,
    validationSchema : AuthVld.ResetPassword,
    isInitialValid : false
  })

  const verifyAccount = async (e) => {
    setState({ ...state, apiError: "", apiResponse: "", loader: true });
    let code = await localforage.getItem('forgotCode');
    if(code != state.code){
    setState({ ...state, apiError: "Invalid Code", apiResponse: "", loader: false });
    }
    else{
      setState({ ...state, codeMatched: true, apiError: "", apiResponse: ""});
    }
  };

  const changePassword = async() =>{
    setState({ ...state, apiError: "", apiResponse: "", loader: true });
    let payload = {...formik.values}

    payload.email = await localforage.getItem('forgotEmail')

    const {response, error} = await AuthService.ChangePassword({payload, toaster : true});
    console.log('error ', error)
    if(error){
      setState({ ...state, apiError: error.message, apiResponse: "", loader: false });
    }
    else{
      setState({ ...state, apiError: "", apiResponse: "", loader: false, success : true });
      navigate('/', {replace : true})
    }
    
  }


  return (
    <div className="middle" id="Email">
      <div className="cardForm">
        <div className="row">
          <div className="col-12 text-center mt_16 mb_16">
            <img
              src={PngIcons.logo}
              height="50px"
              width="auto"
              alt=""
            />
          </div>

          {!state.codeMatched ?
            <form onSubmit={verifyAccount}>
              <div className="Heading2 col-12">Email Verification</div>
              <div className="subtitle1 col-12 mt_8 mb_24">
                Please enter the code we emailed you.
              </div>
              <div className="col-12">
                <div className="inputFields">
                  <VerificationCode
                    length={4}
                    onComplete={handleCode}
                    Validate={Validate}
                    loader={state.loader}
                  />
                </div>
              </div>
              <CustomButton
                varient="primary"
                className="fs-14 col-12 fw-5 mt_32"
                textColor="white"
                onClick={verifyAccount}
                btntext="Verify"
                disabled={
                    state.loader || !state.valid
                }
                icon={
                  state.loader && <CircularProgress size={20} color={"inherit"} />
                }
              />
              <span className="error">{state.apiError}</span>
              {state.apiResponse}
            </form>
          
          :

          <div className="w-100 position-relative">
            <CustomTextField
              label        = "New Password"
              type         = "password"
              name         = "password"
              id           = "password"
              className    = "lh-24"
              defaultValue = {formik.values.password}
              onChange     = {formik.handleChange}
              position="end"
            />
            <div onClick={eyeClick} style={{ position: "absolute", top: "36px", right: "16px" }}>
            {type === "password" ? (
                    <SvgIcons.EyeIconPassword />
                  ) : (
                    <SvgIcons.CrossEyeIcon />
                  )}
          </div>
          <CustomButton
                varient   = "primary"
                className = "fs-14 col-12 fw-5 mt_32"
                textColor = "white"
                onClick   = {changePassword}
                btntext   = "Save"
                disabled={
                  state.loader || !formik.isValid
                }
                icon      = {
                  state.loader && <CircularProgress size={20} color={"inherit"} />
                }
              />
              <span className="error">{state.apiError}</span>
              {state.apiResponse}
                {console.log('success ', state.success)}
          </div> 
          }
        </div>
      </div>
    </div>
  );
}
