import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from '../context/layout.context'

export default function App() {
const layout = useContext(LayoutContext)

useEffect(()=>{
    layout.setLayout({
        showNav : false,
        showFooter: false,
    })
    },[])

  return (
    <div id="Notfound">
      <h1>
        404
      </h1>
      <h2>Not found</h2>
      <p className="text">
        Looks like the page you're looking for doesn't exist <i></i>.<br />
      </p>
    </div>
  );
}
