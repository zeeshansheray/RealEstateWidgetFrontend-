import React, { useContext } from 'react'
import { LayoutContext } from '../context/layout.context'
import { PngIcons } from '../icons'

export default function Footer() {

  const layout = useContext(LayoutContext)

  return (
    <div id="Footer" className={`${!layout.state.showFooter && 'd-none'}`}>
        <footer className="section-p1">
          <div className="col">
            <img className="logo" src={PngIcons.logo} height="25px" alt />
            <h4>Contact</h4>
            <p><strong>Address: </strong> 562 Wellington Road, Street 32, San Francisco</p>
            <p><strong>Phone:</strong> +01 2222 365 /(+91) 01 2345 6789</p>
            <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
            <div className="follow">
              <h4>Follow Us</h4>
              <div className="icon">
                <i className="fab fa-facebook-f" />
                <i className="fab fa-twitter" />
                <i className="fab fa-instagram" />
                <i className="fab fa-pinterest-p" />
                <i className="fab fa-youtube" />
              </div>
            </div>
          </div>
          <div className="col">
            <h4>About</h4>
            <a href="#">About Us</a>
            <a href="#">Delivery Information</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="col">
            <h4>My Account</h4>
            <a href="#">Sign In</a>
            <a href="#">View Cart</a>
            <a href="#">My Wishlist</a>
            <a href="#">Track My Order</a>
            <a href="#">Help</a>
          </div>
          <div className="col install">
            {/* <h4>Install App</h4> */}
            {/* <div className="row">
              <img src={PngIcons.pay.apple} alt />
              <img src={PngIcons.pay.card} alt />
            </div> */}
            <h4>Secured Payment Gateways </h4>
            <p>You can do the payment, from any of the mentioned below.</p>
            <img src={PngIcons.pay.google} alt />
          </div>
          <div className="copyright">
            {/* <p>© 2021</p> */}
          </div>
        </footer>
    </div>
  )
}
