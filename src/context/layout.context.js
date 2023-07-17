import React, { createContext, useState } from 'react'

export const LayoutContext = createContext();

export default function LayoutContextProvider(props) {
    const [state, setState] = useState({
        showNav     : true,
    })

    const setLayout = (values) => setState({...state, ...values})

    return (
      <LayoutContext.Provider value={{state, setLayout}}>
          {props.children}
      </LayoutContext.Provider>
    )
}
