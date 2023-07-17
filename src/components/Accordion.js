import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import SvgIcons from '../icons/svg.icon';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxShadow: 'unset !important'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function CustomAccordion({Component, Title, handleChangeFunc}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion style={{boxShadow: "unset",  border: '1px solid #d6dae9'}}>
        <AccordionSummary
          expandIcon    = {<SvgIcons.ArrowExpand className="rotate-right"/>}
          aria-controls = "panel1a-content"
          id            = "panel1a-header"
          className     = "d-flex align-items-center"
          style         = {{height: '36px', minHeight : '36px'}}
        >
          <h2 contentEditable onInput={(e)=>handleChangeFunc(e.currentTarget.textContent)} className='Body14M mb_0'>{Title}</h2>
        </AccordionSummary>
        <AccordionDetails>
            {Component}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
