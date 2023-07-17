import React, { useState, useEffect, useContext } from 'react'

import {Link, useHistory, useParams} from 'react-router-dom';


import { utils } from '../../../utils';
import {AgencyContext} from '../../../context/Agency.context'
import { ColorSchemeCode } from '../../../enums/ColorScheme';

export default function DashboardChild({mobileCheck, setMobileCheck}) {

    const [selected, setSelected] = React.useState('Home');

    const history = useHistory();

    const params = useParams()

    const agency    = useContext(AgencyContext)


    const items  =   [
                    { 
                        text            :   'Home',
                        link            :   'home',
                        className       :   ''

                    },
                    {
                        text            :   'Audience',
                        link            :   'audience',
                        className       :   ''
                    }
            ] 

    const handleClick = (element) => {
        setMobileCheck(false);
        setSelected(element.text);
    }   


    const [state, setstate] = React.useState('')

    useEffect(() => {
        const color = utils.hexTohsl(agency.agencyColor)
        setstate("hsl("+color.h+","+color.s+"%,"+color.l+"%,"+0.1+")")
    }, [])


    return (
        <div>
            <div class="Heading22M color-Heading sidebarHeading pl-16">Dashboard</div>
            <div className="items">
                {
                    items.map((element, idx)=>( 
                        <Link to={'/'+params._id+'/dashboard/'+element.link} onClick={()=>handleClick(element)}>
                            <div className='navlinkFont item borderRadius-4' style={{color : (history.location.pathname.includes(element.link)) && ColorSchemeCode.brandingPrimaryColor , backgroundColor: (history.location.pathname.includes(element.link)) && ColorSchemeCode.navigationSelectedBg}}>
                                <span className="pl-8 Link13M">{element.text}</span>
                            </div>
                        </Link>
                    ))
                }
            </div>    
        </div>
    )
}
