import React from 'react'
import CustomTextField from '../components/googleMap/Autocomplete';
import { SvgIcons } from '../icons';

export default function HomePage() {
  return (
    <div id="HomePage" className='middle'>
        <h1 className='Heading30B color-white mb_16 boxShadow'>Agents. Tours. Loans. Homes.</h1>
        <div className="w-48">
        <CustomTextField  
            placeholder = "Enter an address, neighborhood, city or ZIP code"
            icon        = {<SvgIcons.SearchIcon height={"24px"} width={"24px"}/>}
            position    = "end"
            padding     = "24px 40px 24px 24px "
            top         = "24px"
            fontSize    = "18px"
        />
        </div>
    </div>
  )
}
