import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'

import {PngIcons} from '../../icons'

import {utils} from '../../utils'


export default function Navbar(props) {

    const [selected, setSelected] = useState('home')

    const params = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if(window.location.pathname.includes('orders')){
            setSelected('orders')
        }
        else if(window.location.pathname.includes('payments')){
            setSelected('payments')
        }
        else if(window.location.pathname.includes('reports')){
            setSelected('reports')
        }
        else if(window.location.pathname.includes('settings')){
            setSelected('settings')
        }
        else if(window.location.pathname.includes('products')){
            setSelected('products')
        }
        else{
            setSelected('summary')
        }
    },[window.location.pathname])


    const handleNavigateFunc = (key)  => {
        let route = window.location.pathname;
        console.log('route ', route);
        route = route.split('/');
        route.splice(3,1);
        route.push(key);
        let newRoute = route.join("/");
        console.log("newRoute ", newRoute);
        navigate(newRoute, {replace : true});
    }

    return (
        <div id="Navbar">
            <section id="header">
                <Link to="/"><a ><img src={PngIcons.logo} className="logo" alt="" /></a></Link>
                <div>
                    <ul id="navbar" className="cp">
                        <li><a onClick={()=>handleNavigateFunc('summary')} className={`navLink ${selected == "summary" && 'active'}`}>Summary</a></li>

                        <li><a onClick={()=>handleNavigateFunc('orders')} className={`navLink ${selected == "orders" && 'active'}`} >Orders</a></li>

                        <li><a onClick = {()=>handleNavigateFunc('payments')} className={`navLink ${selected == "payments" && 'active'}`} >Payments</a></li>

                        <li><a  onClick={()=>handleNavigateFunc('reports')} className={`navLink ${selected == "reports" && 'active'}`}>Reports</a></li>

                        <li><a  onClick={()=>handleNavigateFunc('products')} className={`navLink ${selected == "products" && 'active'}`}>Products</a></li>

                        <li><a onClick={()=>handleNavigateFunc('settings')}>Settings</a></li>

                       <i onClick={()=>utils.Logout()} className="fa fa-sign-out" style={{fontSize : '18px'}}></i>

                        <Link to="" id="close"><i className="far fa-times"></i></Link>
                    </ul>
                </div>
                <div id="mobile">
                    <Link to="cart"  className={`navLink ${selected == "cart" && 'active'}`}><i className="far fa-shopping-bag"></i></Link>
                    <i id="bar" className="fas fa-outdent"></i>
                </div>
            </section>
        </div>
      )
    }
