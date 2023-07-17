import React, { useState } from "react";

import CustomToasters from "../components/CustomToasters";

const ToasterContext = React.createContext();

function withToaster(Component){
    function Toaster(props){
        console.log('props ', props);
        const [state, setState] = useState({position: 'bottom-right', notifications: []})
    
        const showToaster = ({position, title, message, severity}) => {
            const notification = {title, message, severity}
            const filterNotifications = state.notifications.filter(notification => notification.progress < 100)
            setState({
                position      : position || state.position,
                notifications : [...filterNotifications, {...notification, progress: 0, pause: false}]
            })
        }
    
        const handleNotificationUpdates = (updateNotifications) => setState({...state, notifications: updateNotifications})
    
        return(
            <ToasterContext.Provider value={{showToaster: showToaster}}>
                <Component {...props} />
                <CustomToasters position={state.position} notifications={state.notifications} updateToast={handleNotificationUpdates} />
            </ToasterContext.Provider>
        )
    }

    return Toaster
}


export { withToaster, ToasterContext }