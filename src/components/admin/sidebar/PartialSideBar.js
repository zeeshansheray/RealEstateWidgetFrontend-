import React, { useContext, useEffect } from 'react';
import {Link, useLocation, useParams} from 'react-router-dom';

import ReactTooltip from 'react-tooltip';
import ClickOutside from '../../../utils/ClickOutside';

import { utils } from '../../../utils';
import { ColorSchemeCode } from '../../../enums/ColorScheme';
import { PngIcons, SvgIcons } from '../../../icons';

import { UserContext } from '../../../context/user.context';

export default function PartialSideBar({setItemsSub, items}) {

    const params  = useParams()

    console.log('zee 2')

    const user = useContext(UserContext);

    const location = useLocation();

    const [showLogoutMenu, setShowLogoutMenu] = React.useState(false);
    const [selected, setSelected ] = React.useState('Dashboard');

    const handleClick = (element) => 
        {   
            if(!element.disabled){
                element.subMenu && setItemsSub(element.childern);
                setSelected(element.name)
            }
        }   


    return (
        <div className="pSide">
            <div className="subBrandImageBox middle">
                <img src={PngIcons.logo} className="borderRadius-50 border object-fit-contain" height="50" width="50" alt="" />
            </div>
            <nav className="navPartial d-flex flex-column" >
                <ReactTooltip backgroundColor={ColorSchemeCode.GeneralBlack} className="opacity-8 p-10 borderRadius-6 Caption13R" place="left"/>
                {
                    items.map((element, idx)=>(
                        <Link className={element.className} to={!element.disabled && `/admin/${user._id}`+element.link}  onClick={() => handleClick(element)}>
                            <div className={`middle cp active ${(location.pathname.includes(element.name.toLowerCase()) && 'NavselectedItem')}`}  data-tip={element.name} >
                                <element.logo />
                            </div>
                        </Link>
                    ))
                }
            </nav>
            <div className="userProfileIcon text-center cp col-12 text-uppercase" onClick={()=>setShowLogoutMenu(!showLogoutMenu)}>
                    {
                        utils.getAvatar({firstName: user.fullName, lastName: '', bgColor:"#2F80ED", className: 'm-auto', width: '40px', heigth: '40px'})
                    }
            </div>

            {showLogoutMenu &&
                <ClickOutside onClick={()=>setShowLogoutMenu(false)}>
                    <div className="card borderRadius-8 logoutMenu" >
                        <div className="Body14R singleItemLogoutMenu cp mt-4 mb-4 color-ButtonWarningPressedText" onClick={()=> utils.Logout()}>
                            Logout
                        </div>
                    </div>
                </ClickOutside>
            }

        </div>
    )
}
