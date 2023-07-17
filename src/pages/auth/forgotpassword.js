import React, { useContext, useEffect, useState } from 'react'

import AuthService from '../../services/Auth'
import CircularProgress from "@material-ui/core/CircularProgress";

import {useFormik} from 'formik'

import {SvgIcons} from '../../icons'

import CustomTextField from '../../components/CustomTextField'
import CustomButton from '../../components/CustomButton'

import { Link, useNavigate } from 'react-router-dom';
import { LayoutContext } from '../../context/layout.context';

import {AuthVld} from '../../validation'
import { UserContext } from '../../context/user.context';
import localforage from 'localforage';
import { utils } from '../../utils';

export default function ForgotPassword() {

  const [state, setState] = useState({
    loader         : false,
    apiError       : "",
    emailSendScreen: true,
  });
  const [type, settype] = useState("text");

  const layout  = useContext(LayoutContext)
  const user    = useContext(UserContext)
  const navigate = useNavigate();

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

  useEffect(()=>{
    layout.setLayout({
      showNav : false,
      showFooter: false,
    })
    // onload();
  },[])


  const initValues = {
    email   : "",
    password: ""
  }

  const formik = useFormik({
    initialValues : initValues,
    validationSchema : state.emailSendScreen ? AuthVld.ForgetPassword : AuthVld.ResetPassword,
    isInitialValid : false
  })

  const handleChangePasswordFunc = async() =>{
    setState({...state, loader : true})

    let payload = {
      password: formik.values.password
    }

    
    const {response, error} = await AuthService.ChangePassword({payload})
    console.log('response ', response);
    console.log('error ', error);

    if(response){
      console.log('Hi', response)
    }
    else{
      setState({...state, loader : false, apiError : error.message})
    }
  }

  const handleEmailSendFunc = async() => {
    let code = Math.floor(1000 + Math.random() * 9000);
    localforage.setItem('forgotCode', code);
    localforage.setItem('forgotEmail', formik.values.email);


    let payload = {
      email: formik.values.email,
      code : code,
    }
    console.log('payload ', payload)


    const {response, error} = await AuthService.SendEmail({payload});
    if(error){
      console.log('error')
      setState({...state, apiError : error.message})
    }
    else{
      console.log('here')
      navigate('/emailverify', {replace : true})
    }
  }
  
  return (
      <div className="position-relative">
          <div id='Auth' className="LoginCardLayout">
              <div className="cardForm" >
                  <div>
                      <div className='align-items-center  w-100 flex-row space-between'><div className="Heading24M lh-32 color-neutral100 text-center">Forgot Password</div>    
                        <div className="auth-form">
                        <div className="w-100">
                            <CustomTextField
                              label        = "Email address"
                              type         = "text"
                              name         = "email"
                              className    = "lh-24"
                              autoFocus    = {true}
                              defaultValue = {formik.values.email}
                              onChange     = {formik.handleChange}
                              error        = {formik.errors.email}
                              helperText   = {
                                formik.errors.email
                                  ? formik.errors.email
                                  : ""
                              }
                            />
                          {state.apiError && <div className={"error"}>{state.apiError}</div>}
                          </div>


                          <div className="w-100 pt_8 gap-12 d-flex flex-column">
                            <CustomButton
                              varient="primary"
                              btntext="Send Email"
                              className="w-100 hpx-52"
                              disabled={state.loader || !formik.isValid}
                              onClick={state.emailSendScreen ? handleEmailSendFunc : handleChangePasswordFunc}
                              icon={
                                state.loader && <CircularProgress size={20} color={"inherit"} />
                              }
                            />
                            <div className="d-flex justify-flex-end w-100">
                            {!window.location.pathname.includes('merchant') && !window.location.pathname.includes('admin')&&<Link
                              to={ "/signup"}
                              className="underline Body14R color-neutral70"
                            >
                                Don't have an account?
                            </Link>}
                            
                          </div>
                          </div>
                        </div>
                  </div>
              </div>
              <div className='w-100 text-center'>
                <span className=" Caption12R color-neutral60 text-center">
                  ® {new Date().getFullYear()} <span className="capitalize"></span> All rights reserved. 
                </span>
              </div>
          </div>
        </div>
    </div>
  )
}
