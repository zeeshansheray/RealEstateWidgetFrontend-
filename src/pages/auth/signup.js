import React, { useContext, useEffect, useState } from 'react'

import AuthService from '../../services/Auth'
import CircularProgress from "@material-ui/core/CircularProgress";

import {useFormik} from 'formik'

import {SvgIcons} from '../../icons'

import CustomTextField from '../../components/CustomTextField'
import CustomButton from '../../components/CustomButton'

import { Link } from 'react-router-dom';
import { LayoutContext } from '../../context/layout.context';

import {AuthVld} from '../../validation'
import { UserContext } from '../../context/user.context';

import {useNavigate} from 'react-router-dom'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


export default function Signup() {

  const [state, setState] = useState({
    loader  : false,
    apiError: "",
  });
  const [type, settype] = useState("text");

  const layout   = useContext(LayoutContext)
  const user     = useContext(UserContext)
  const history = useNavigate();


  const eyeClick = () => {
    console.log('dadas')
    var x = document.getElementById("password");
    console.log('settype ', x.type)
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
      showNav   : false,
      showFooter: false,
    })
    // onload();
  },[])


  console.log('settype ', type)

  const initValues = {
    email    : "",
    fullName : "",
    password : "",
    phone    : "",
    storeName: ""
  }

  const formik = useFormik({
    initialValues : initValues,
    validationSchema : window.location.pathname.includes('merchant') ? AuthVld.MerchantSignupVld : AuthVld.SignupVld,
    isInitialValid : false
  })

  const handleSignupFunc = async() =>{
    setState({...state, loader : true})

    let payload = {
      ...formik.values,
      email: formik.values.email.toLocaleLowerCase(),
      fullName: formik.values.fullName.toLocaleLowerCase(),
    }

    delete payload.storeName;

    if(window.location.pathname.includes('admin')){
      payload.role = 1
    }
    

    else if(window.location.pathname.includes('merchant')){
      payload.role = 3
      payload.storeName = formik.values.storeName
    }

    console.log('payload ', payload)

    const {response, error} = await AuthService.Signup({payload})
    console.log('error ', error, response)
    if(response.success){
      setState({...state, loader : false, apiError:''})
      console.log('response ', response.data);
      user.updateUser(response.data);
      if(window.location.pathname.includes('merchant')){
        let url = window.location.pathname;
        url = url.split('/')
        url = url.splice(0,2);
        url = url.join("/");
        history(`${url}/${response.data._id}/dashboard`)
      }
      else if(window.location.pathname.includes('admin')){
        let url = window.location.pathname;
        url = url.split('/')
        url = url.splice(0,2);
        url = url.join("/");
        history(`${url}/${response.data._id}/dashboard`)
      }
      else{
          history(`/`)
      }
    }
    else{
      setState({...state, loader : false, apiError : response.message})
      
    }

  }
  
  return (
      <div className="position-relative">
          <div id='Auth' className="LoginCardLayout">
              <div className="cardForm" >
                  <div>
                  <div className='align-items-center  w-100 flex-row space-between mb-32'><div className="Heading24M lh-32 color-neutral100 text-center">{window.location.pathname.includes('merchant') ? 'Merchant ' : window.location.pathname.includes('admin') ? 'Admin ' : ""} Signup</div>    
                        <div className="auth-form">
                          <div className="w-100">
                            <CustomTextField
                              label        = "Full Name*"
                              type         = "text"
                              name         = "fullName"
                              className    = "lh-24"
                              autoFocus    = {true}
                              defaultValue = {formik.values.fullName}
                              onChange     = {formik.handleChange}
                              error        = {formik.errors.fullName}
                              helperText   = {
                                formik.errors.fullName
                                  ? formik.errors.fullName
                                  : ""
                              }
                            />
                          </div>

                          {window.location.pathname.includes('merchant') && <div className="w-100">
                            <CustomTextField
                              label        = "Store Name*"
                              type         = "text"
                              name         = "storeName"
                              className    = "lh-24"
                              autoFocus    = {true}
                              defaultValue = {formik.values.storeName}
                              onChange     = {formik.handleChange}
                              error        = {formik.errors.storeName}
                              helperText   = {
                                formik.errors.storeName
                                  ? formik.errors.storeName
                                  : ""
                              }
                            />
                          </div>}

                          <div className="w-100">
                            <CustomTextField
                              label        = "Email address*"
                              type         = "text"
                              name         = "email"
                              className    = "lh-24"
                              defaultValue = {formik.values.email}
                              onChange     = {formik.handleChange}
                              error        = {formik.errors.email}
                              helperText   = {
                                formik.errors.email
                                  ? formik.errors.email
                                  : ""
                              }
                            />
                          </div>

                          <div className='w-100'>
                          <h4 className='Body13M lh-16 mb_8 capitalize'>Phone*</h4>
                          <PhoneInput
                              country   = {'qa'}
                              inputClass = "w-100 phoneField"
                              value     = {formik.values.phone}
                              onChange  = {phone => formik.setValues({...formik.values, phone : phone})}
                            />
                          </div>

                          <div className="w-100 position-relative">
                            <CustomTextField
                              label        = "Password*"
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
                          {state.apiError && <div className={"error"}>{state.apiError}</div>}
                          </div>

                          <div className="w-100 pt_8 gap-12 d-flex flex-column">
                            <CustomButton
                              varient="primary"
                              btntext="Sign Up"
                              className="w-100 hpx-52"
                              disabled={state.loader || !formik.isValid}
                              onClick={handleSignupFunc}
                              icon={
                                state.loader && <CircularProgress size={20} color={"inherit"} />
                              }
                            />
                            <div className="text-center w-100">
                            {!window.location.pathname.includes('merchant') && !window.location.pathname.includes('admin')&&<Link
                                to={"/login"}
                              className="underline Body14R color-neutral70"
                            >
                                Already have an account? Login Now
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
