import localforage from "localforage";
import React, { Component } from "react";
import Loader from '../components/Loader'

const CartContext = React.createContext();

class CartContextComponent extends Component {
  state = {loader: true}

  
  componentDidMount = async () => {
    const cartDetails = await localforage.getItem('cartDetails')
    this.setState({loader: false, ...cartDetails})
  }

  updateCart = (cartDetailsUpdates) => {
    console.log(cartDetailsUpdates);
    const cartDetails = {...this.state, ...cartDetailsUpdates}
    this.setState(cartDetails)
    localforage.setItem('cartDetails', {...cartDetails})
  }



  render() {
    return (
      this.state.loader ? 
      <Loader/>
      :
      <CartContext.Provider value={{...this.state, updateCart: this.updateCart}}>
        {this.props.children}
      </CartContext.Provider>
    )
  }
}

export { CartContext, CartContextComponent }