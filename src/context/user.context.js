import React, { Component } from "react";
import * as localForage from 'localforage'

import Loader from '../components/Loader'

const UserContext = React.createContext();

class UserContextComponent extends Component {
  state = {loader: true}

  
  componentDidMount = async () => {
    const user = await localForage.getItem('user')
    this.setState({loader: false, ...user})
  }

  updateUser = (updates) => {
    console.log(updates);
    const updatedUser = {...this.state, ...updates}
    this.setState(updatedUser)
    localForage.setItem('user', {...updatedUser})
  }



  render() {
    return (
      this.state.loader ? 
      <Loader/>
      :
      <UserContext.Provider value={{...this.state, updateUser: this.updateUser}}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export { UserContext, UserContextComponent }