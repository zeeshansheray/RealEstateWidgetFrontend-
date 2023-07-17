import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/cart.context'

import { LayoutContext } from '../context/layout.context'
import { UserContext } from '../context/user.context'

import {PngIcons} from '../icons'

import {utils} from '../utils'


export default function Navbar() {

    const layout = useContext(LayoutContext)
    const user = useContext(UserContext)
    const cart = useContext(CartContext)

    const [count, setCount] = useState();

    const [selected, setSelected] = useState('home')

    useEffect(() => {
        if(window.location.pathname?.includes('products')){
            setSelected('products')
        }
        else if(window.location.pathname?.includes('blog')){
            setSelected('blog')
        }
        else if(window.location.pathname?.includes('contact')){
            setSelected('contact')
        }
        else if(window.location.pathname?.includes('user')){
            setSelected('user')
        }
        else if(window.location.pathname?.includes('cart')){
            setSelected('cart')
        }
        else{
            setSelected('home')
        }

        if(cart && cart.products){
            let count = 0;
            // cart.products.map((element, idx)=>{
            //     count = count + element.quantity;
            // })

            setCount(cart.products.length);
        }
    },[window.location.pathname])


    return (
        <div id="Navbar" className={`${!layout.state.showNav && 'd-none'}`}>
            <section id="header">
                <Link to="/"><a ><img src={PngIcons.logo} height="35px" className="logo" alt="" /></a></Link>
                <div>
                    <ul id="navbar" className="cp">
                        <li><Link to="/" className={`${selected == "home" && 'active'}`} href="index.html">Home</Link></li>

                        <li><Link to="/products" className={`${selected == "products" && 'active'}`} >Shop</Link></li>

                        <li><Link  to="/contact" className={`${selected == "contact" && 'active'}`}>Contact</Link></li>

                        {(!user.fullName || user?.types?.includes(1) || user?.types?.includes(3))  &&  <li><Link to="/login" >User Login</Link></li>}

                        {(!user?.fullName || user?.types?.includes(1) || user?.types?.includes(3))  &&  <li><Link to="/merchant" >Merchant</Link></li>}

                        {(user?.fullName && !user?.types?.includes(3) && !user?.types?.includes(1)) && <li><Link to={"/user"} className={`${selected == "user" && 'active'}`} >{`${user.fullName.split(" ")[0]}'s Account`}</Link></li>}

                        <li id="lg-bag"><Link to="/cart" className={`${selected == "cart" && 'active'}`} ><i className="far fa-shopping-bag"></i><div style={{position: 'absolute', zIndex: 2, top:'5px', left:'44%', fontSize: '11px', fontWeight: 'bold'}}>{count}</div></Link></li>

                        {user.fullName && <i onClick={()=>utils.Logout()} className="fa fa-sign-out" style={{fontSize : '18px'}}></i>}

                        <Link to="" id="close"><i className="far fa-times"></i></Link>
                    </ul>
                </div>
                <div id="mobile">
                    <Link to="cart"  className={`${selected == "cart" && 'active'}`}><i className="far fa-shopping-bag"></i></Link>
                    <i id="bar" className="fas fa-outdent"></i>
                </div>
            </section>
        </div>
      )
    }
