import React from 'react'
import PngIcons from '../icons/png.icon';

export default function Loader() {
  return (
    <div className='mainLoader'>
       <img src={PngIcons.loader} height="50px" width={50} />
    </div>
  )
}
