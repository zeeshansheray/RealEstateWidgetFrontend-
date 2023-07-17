import React, { useState, useEffect, useContext } from 'react'

import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';

import { utils } from '../../../../utils';

import { ColorSchemeCode } from '../../../../enums/ColorScheme';

export default function SettingSubChild({mobileCheck, setMobileCheck}) {

    const [selected, setSelected] = useState('Company Profile');
    const location = useLocation();
    const history = useNavigate();
    const [state, setstate] = React.useState('')
    
    const items  =   [
                {
                    icon     : '',
                    text     : 'Company Profile',
                    select   : 'Company Profile',
                    link     : '',
                    className: '',
                },
                {
                    icon     : '',
                    text     : 'Billing',
                    link     : 'billing',
                    select   : 'billing',
                    className: '',
                },
                {
                    icon     : '',
                    text     : 'Locations',
                    link     : 'locations',
                    select   : 'locations',
                    className: '',
                },
                // {
                //     icon     : '',
                //     text     : 'Stripe',
                //     link     : 'stripe',
                //     select   : 'stripe',
                //     className: '',
                // },
        ]   
        

    const handleClick = (element) => {
        setSelected(element.text);
        history('settings/'+element.link)
    }   


    useEffect(()=>{
        for(let element of items){
            if(location.pathname.includes(element.select.toLocaleLowerCase())){
                console.log('if workedd')
                setSelected(element.text);
                return
            }
            else{
                console.log('else workedd')
                setSelected('Company Profile')
            }
        }
    },[location.pathname])
    

    return (
        <div>
            <div class="Heading22M color-Heading sidebarHeading pl-16">Settings</div>
            <div className="items">
                {
                    items.map((element, idx)=>(
                        <div > 
                            <div onClick={()=>handleClick(element)}>
                                <div className='navlinkFont item borderRadius-4' style={{color : (selected === element.text) && ColorSchemeCode.brandingPrimaryColor , backgroundColor: (selected === element.text) && ColorSchemeCode.navigationSelectedBg}}>
                                    {element.icon}
                                    <span className="pl-8 Link13M">{element.text}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            
        </div>
    )
}
