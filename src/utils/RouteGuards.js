import React, { useContext } from 'react';
import {Route, redirect, Navigate} from 'react-router-dom';

import { UserContext } from '../context/user.context';

function UserAuthGuard({children}){
    const user = useContext(UserContext);
        if(!user.email && !user?.types?.includes(1) && !user?.types?.includes(3) && !window.location.pathname.includes('login')) {
            return <Navigate to="/" replace />
        }
        else if(user.email && !user?.types?.includes(1) && !user?.types?.includes(3) && window.location.pathname.includes('login')) {
            return <Navigate to="/" replace />
        }
        else{
            return children
        }
}

function MerchantAuthGuard({children}){
    const user = useContext(UserContext);
    if(!user.fullName || !user?.types?.includes(1) && !user?.types?.includes(2) &&  !user?.types?.includes(3)){
        return <Navigate to="/merchant" replace />
    }  
    else if(!user.fullName || !user?.types?.includes(1) && !user?.types?.includes(2) &&  !user?.types?.includes(3)){
        return <Navigate to={`/merchant/${user._id}`} replace />
    }  
    else{
        return children
    }   
}

function AdminAuthGuard({children}){
    const user = useContext(UserContext);
    if(!user?.types?.includes(3) && !user.email){
        return <Navigate to="/merchant/login" replace />
    }  
    else{
        return children
    }   
}

export {
    UserAuthGuard,
    AdminAuthGuard,
    MerchantAuthGuard
}