import { CircularProgress } from '@material-ui/core'
import React from 'react'
import CustomButton from './CustomButton'

function DeleteModal(props) {
    return (
        <div className="mt_8">
            <div className="color-neutral100 Heading22M mb_16">
                Are you sure you want to delete?
            </div>
            <div className="color-neutral60 Body14R">
                This is permanent. You won't be able to get your <span className='color-warning30 Body14M'>{props.title}</span>  back.
            </div>
            <div className="d-flex justify-flex-end mt_24">
                <div>
                    <CustomButton 
                        varient = "secondary"
                        btntext = "Cancel"
                        onClick = {props.onCancel}
                        />
                </div>
                <div className="ml_8">
                    <CustomButton 
                        varient = "warning"
                        btntext = "Delete"
                        icon    = {props.icon && <CircularProgress size={20} color={'inherit'}/>}
                        onClick = {props.onDelete}
                    />
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
