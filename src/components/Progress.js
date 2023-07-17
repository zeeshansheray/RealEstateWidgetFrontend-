import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function CircularProgressWithLabel(props) {

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <div className='outerCircle' style={{height: props.size, width: props.size}}>
      </div>
      <CircularProgress thickness={props.thickness || 2.3}  size={props.size} variant="determinate" {...props}/>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {props.component ? 
            props.component : 
            <Typography variant="caption" component="div" color="text.secondary" style={{fontSize: props.fontSize}}>
            {`${Math.round(props.value)}%`}
            </Typography>
        }
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value    : PropTypes.number.isRequired,
  style    : PropTypes.object,
  size     : PropTypes.number,
  fontSize: PropTypes.number,
  thickness: PropTypes.number,
  component: PropTypes.element,
};

export default function Progress({start, size, component, fontSize, color, thickness}) {
  const [progress, setProgress] = React.useState(10);
    
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //       setProgress((prevProgress) => (progress <= start && progress + 10));
  //   }, 400);
  //   return () => {
  //   };
  // }, []);

  return <CircularProgressWithLabel size={size} thickness={thickness} component ={component} style={{color: color}} fontSize={fontSize}  value={start} />;
}
