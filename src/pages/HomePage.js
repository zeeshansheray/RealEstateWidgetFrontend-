import React, {useState} from 'react'
import CustomTextField from '../components/googleMap/Autocomplete';
import { SvgIcons } from '../icons';
import { useFormik } from 'formik';

export default function HomePage() {

    const initState={
        location         : {},
    }

    const formik = useFormik({
        initialValues      : { ...initState },
    })

  const onAddressChange = (event) => formik.setValues({ ...formik.values, location: { ...formik.values.location, address: event.target.value } })
  const locationSummary = (location) => {
    formik.setValues({ ...formik.values, location: {...location}   })
}

  console.log('formik ',formik.values)

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
            locationSummary = {locationSummary}
            onChange        = {onAddressChange}

        />
        </div>
    </div>
  )
}
