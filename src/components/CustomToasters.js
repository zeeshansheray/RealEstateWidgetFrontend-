import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Fade from 'react-reveal/Fade';

import { PngIcons, SvgIcons } from '../icons'
import { enums } from '../enums';
import { ColorSchemeCode } from '../enums/ColorScheme';

function CustomToasters({position, notifications, updateToast, delay}){
    const [list, setList] = useState(notifications)

    const updateToasters = () => setList(notifications)

    useEffect(updateToasters, [notifications])

    const handleMouseHover = (idx, pause) => {
        list[idx].pause = pause
        setList([...list])
    }

    useEffect(() => {
        const filteredList = list?.filter(notification => notification.progress < 100)
        if(!filteredList?.length) return

        const timer = setInterval(()=> {
            if(!list?.length) return
            const updatedList = list.map(toast => {
                if(toast.progress <= 100 && !toast.pause) toast.progress = toast.progress + 1
                return toast
            })
            setList([...updatedList])
        }, (delay ? delay : enums.TOASTER_DELAY)/100)
    
        return () => clearInterval(timer)

    }, [list])


    return (
        <div id="Toaster">
            <div className={`notification-container ${position}`}>
                {   list &&
                    list.map((notification, idx) => (
                        <Fade key={idx} collapse right={position.includes('right')} left={position.includes('left')} collapse 
                        when={notification.progress < 90}
                        >
                            <div 
                                onMouseEnter={()=> handleMouseHover(idx, true)} 
                                onMouseLeave={()=> handleMouseHover(idx, false)} 
                                className={`notification toast ${position} ${notification.severity}`}
                                style={{borderLeft: notification.severity === 'error' ? '6px solid '+ColorSchemeCode.ButtonWarningText : notification.severity === 'success' ? '6px solid '+ColorSchemeCode.selectGreenBackgroundColor : notification.severity === 'info' ? '6px solid '+ColorSchemeCode.themeColor : ''}}
                            >
                                {/* <div className="float-right">
                                    <CircularProgressbarWithLabel 
                                        value={notification.progress}
                                        label={ <button onClick={() => deleteToaster(idx)}>x</button> } 
                                        size={26}
                                    />
                                </div> */}
                                <div className="d-flex align-items-center">
                                    <div className="notification-image">
                                        {notification.severity === 'error' ? <SvgIcons.IconStop /> : notification.severity === 'success' ? <SvgIcons.IconCheckList /> : notification.severity === 'info' ? <SvgIcons.IconInformation /> : ''}
                                    </div>
                                    <div className="align-self-center notification-message Caption12R color-GeneralBlack">{notification.message}</div>
                                </div>
                            </div>
                        </Fade>
                    ))
                }
            </div>
        </div>
    )
}

CustomToasters.defaultProps = {
    position : 'bottom-right',
    severity : 'error'
}

CustomToasters.propTypes = {
    position      : PropTypes.string,
    notifications : PropTypes.array.isRequired
}

export default CustomToasters;