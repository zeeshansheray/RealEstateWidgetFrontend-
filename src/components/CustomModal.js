import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CustomButton from '../components/CustomButton';

import { ColorSchemeCode } from '../enums/ColorScheme';

const useStyles = makeStyles((theme) => ({
  modal: {
    display        : 'flex',
    alignItems     : 'flex-start',
    justifyContent : 'center',
    margin         : 'auto',
    fontFamily     : 'Inter',
    borderRadius   : '8px',
    width          : '90%',
    zIndex         : '100 !important'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding        : props=> props.padding || '24px',
    maxWidth       : props => props.maxWidth || '400px',
    minWidth       : props => props.minWidth || '100px',
    position       : props => props.position || 'relative',
    marginTop      : '0px',
    outline        : '0px !important',
    marginBottom   : '40px',
    maxHeight      : '96% !important',
    top            : props => props.top || '12px',
    left           : props => props.left,
    fontFamily     : 'Inter !important',
    border         : '1px solid ' + ColorSchemeCode.neutral20,
    // maxHeight      : props => props.maxHeight || 'fit-content',
    minHeight      : props => props.minHeight || 'fit-content',
    overflowY      : 'auto',
    boxShadow      : props => props.boxShadow == false ? 'none' : '0px 0px 0px 1px rgba(29, 28, 29, 0.13), 0px 18px 45px rgba(0, 0, 0, 0.35)',
    borderRadius   : '4px',
    MozUserFocus   : 'none'
  },
}));

export default function CustomsModal({open, component, onClose, minWidth, maxWidth, backgroundColor, position, title, onSave, top, left, ...props}) {
  const classes = useStyles({minWidth, maxWidth, position, top, left, ...props});
  return (
    <div id="modal">
      <Modal
        aria-labelledby   = "transition-modal-title"
        aria-describedby  = "transition-modal-description"
        className         = {classes.modal + ''}
        open              = {open}
        onClose           = {onClose}
        BackdropComponent = {Backdrop}
        BackdropProps     = {{timeout: 500, style: {backgroundColor : backgroundColor}}}
        closeAfterTransition
      >
        <Fade in={open}>
          <div className={classes.paper} >
            <div className='Heading18M color-neutral100'>
                {title}
            </div>
              {component}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
