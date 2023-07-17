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

export default function Login() {

  const [state, setState] = useState({
    loader  : false,
    apiError: "",
  });
  const [type, settype] = useState("text");

  const layout   = useContext(LayoutContext)
  const user     = useContext(UserContext)
  const history = useNavigate();


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
    validationSchema : AuthVld.LoginVld,
    isInitialValid : false
  })

  const handleLoginFunc = async() =>{
    setState({...state, loader : true})

    let payload = {
      ...formik.values
    }

    if(window.location.pathname.includes('merchant')){
      payload.type = 3
    }

    else if(window.location.pathname.includes('admin')){
      payload.type = 1
    }
    else{
      payload.type = 2
    }

    console.log('payload ', payload);
    
    const {response, error} = await AuthService.Login({payload})
    console.log('response ', response);
    console.log('error ', error);

    if(response){
      setState({...state, loader : false, apiError:''})
      user.updateUser(response.data);
      if(response.data.types.includes(3) && window.location.pathname.includes('merchant')){
        console.log('1')
        history(`/merchant/${response.data._id}/dashboard`)
      }
      else if(response.data.types.includes(1) && window.location.pathname.includes('admin')){
        console.log('2')
        history(`/admin/${response.data._id}/dashboard`)
      }
      else if (!response.data.types.includes(1) && !response.data.types.includes(3)){
        console.log('3')
        history('/');
      }
      else{
      setState({...state, loader : false, apiError : "Invalid Credentials"})
      }
    }
    else{
      setState({...state, loader : false, apiError : error.message})
    }
  }
  
  return (
      <div className="position-relative">
          <div id='Auth' className="LoginCardLayout">
              <div className="cardForm" >
                  <div>
                      <div className='align-items-center  w-100 flex-row space-between'><div className="Heading24M lh-32 color-neutral100 text-center">{window.location.pathname.includes('merchant') ? 'Merchant ' : window.location.pathname.includes('admin') ? 'Admin ' : ""} Login</div>    
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
                          </div>

                          <div className="w-100 position-relative">
                            <CustomTextField
                              label        = "Password"
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
                              btntext="Sign In"
                              className="w-100 hpx-52"
                              disabled={state.loader || !formik.isValid}
                              onClick={handleLoginFunc}
                              icon={
                                state.loader && <CircularProgress size={20} color={"inherit"} />
                              }
                            />
                            <div className="d-flex w-100 space-between">
                           
                              <Link
                                to={ "/forgotpassword"}
                                className="Body14R color-warning40"
                              >
                                  Forgot Password
                              </Link>

                            { !window.location.pathname.includes('admin')&&<Link
                              to={window.location.pathname.includes('merchant') ? "/merchant/signup" : "/signup"}
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
