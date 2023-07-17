import React,{useState, useEffect, useContext} from 'react'
import {useLocation, useNavigate} from 'react-router-dom';

import PartialSideBar from './PartialSideBar'

import SettingSubChild from './sidebarSubChilds/SettingSubChild';
import ProfileSettingChild from './sidebarSubChilds/ProfileSettingChild';


import SvgIcons from '../../../icons/svg.icon';
import { LayoutContext } from '../../../context/layout.context';
import SidebarSub from './SidebarSub';
import Orders from '../../../pages/merchant/orders';

export default function SidebarNav({mobileCheck, setMobileCheck}) {

    const history  = useNavigate();
    const location = useLocation();
    const layout   = useContext(LayoutContext);

    const [itemsSub, setItemsSub] = useState([])

    const items = [
        {
            link      : '/dashboard',
            logo      : SvgIcons.NavDashboardIcon,
            className : `items middle mb_16`,
            name      : 'Dashboard',
            subMenu   : false,
            children  : ""
        },
        {
            link      : '/orders',
            logo      : SvgIcons.OrdersIcon,
            className : `items middle mb_16`,
            name      : 'Orders',
            subMenu   : false,
            childern  : '',
            disabled  : false
        },
        {
            link      : '/products',
            logo      : SvgIcons.InventoryIcon,
            className : 'items middle mb_16',
            subMenu   : true,
            name      : 'Products',
            childern  : '',
            disabled  : false
        },
        {
            link      : '/payments',
            logo      : SvgIcons.CardIcon,
            className : 'items middle mb_16',
            subMenu   : true,
            name      : 'Payments',
            childern  : '',
            disabled  : false
        },
        {
            link      : '/reports',
            logo      : SvgIcons.ReportsIcon,
            className : 'items middle mb_16',
            subMenu   : true,
            name      : 'Reports',
            childern  : '',
            disabled  : false
        },
        {
            link      : '/settings',
            logo      : SvgIcons.SettingIcon,
            className : 'items middle mb_16',
            subMenu   : true,
            name      : 'Settings',
            childern  : '',
            disabled  : false
        },
    ]

    const onLoad = () => {
        items.map((element,idx)=>((location.pathname.includes(element.link)) && setItemsSub(element.childern)))
    }

    useEffect(onLoad, [])

    return (
        <div className={"d-flex flex-row " + (!layout.state.expandedBar ? 'handleSiderBarShadow' : '')} id="sidebar">
        <div className={(mobileCheck) ? 'partailSideNav' : 'hidePartial partailSideNav z-index-2'}>
            <PartialSideBar 
                items       = {items}
                setItemsSub = {setItemsSub}
            />
        </div>
    </div>
    )
}
