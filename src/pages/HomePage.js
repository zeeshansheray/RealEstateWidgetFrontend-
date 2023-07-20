import React, {useEffect, useState} from 'react'
import AuthService from '../services/Auth';
import PngIcons from '../icons/png.icon';
import { SvgIcons } from '../icons';
import localforage from 'localforage';
import GoogleMapReact from 'google-map-react';

export default function HomePage() {

  const [state, setState] = useState({
    loader: true,
    data  : [],
    map   : false
  })

  const onLoad = async() => {
    setState({...state, loader : true})
    let data = await localforage.getItem('data');
    if(data){
        setState({...state, data : data, loader : false})
    }
    let query = {
      ref : 'des54556'
    }
    const {response,error} = await AuthService.GetData({query});
    if(response){
      setState({...state, data : response.data, loader : false})
      localforage.setItem('data', response.data)
    }
    else{
      setState({...state, data : [], loader : false})
    }
    console.log('fetched Data ', response)
  }

  useEffect(()=>{
    onLoad();
  },[])

  function calculateAreaInSqft(lengthInInches, widthInInches) {
    const inchesPerFoot = 12;
    const lengthInFeet  = lengthInInches / inchesPerFoot;
    const widthInFeet   = widthInInches / inchesPerFoot;
    const areaInSqft    = lengthInFeet * widthInFeet;
    return Math.round(areaInSqft);
  }
  
  function parseInput(input) {
    // Check if the input contains 'x' to indicate dimensions
    if (input?.includes('x')) {
      const [length, width] = input.split('x').map(Number);
      return calculateAreaInSqft(length, width);
    } else {
      // If it's a simple number, return it as it is
      return Number(input);
    }
  }
  

  return (
    <div id="HomePage" className='middle'>        
      <div className='container'>
      <div className='d-flex justify-flex-end w-100 align-items-center'>
            <div className='d-flex align-items-center cp' onClick={()=>setState({...state, map : false})}>
                <img width={"13px"} height={"13px"} src={PngIcons.menu} alt="" />
                <span className='Heading15M color-Heading ml_4'>Tile</span>
            </div>
            <div className='d-flex align-items-center ml_20 cp' onClick={()=>setState({...state, map : true})}>
                <SvgIcons.LocationIcon />
                <span className='Heading15M color-Heading ml_4'>Map</span>
            </div>
        </div>
      </div>
      <div className={`mainContainer d-flex h-100vh overflow-scroll w-100  ${state.map && 'paddingFix'}`}>
      <div class={`container ${state.map && 'w-50'}`}>
        
        {state.loader ? <img className='absoluteMiddle' src={PngIcons.loader} width="50px" height={"auto"} alt="" />  : 
        <>
     
        {state.data && state?.data.map((data)=>
        <div class={`box ${state.map && 'twoBoxes'} `}>
          <div class="top">
            <img src={data?.media[0]?.MediaURL} alt="" height={"165px"} width="100%" />
            <p className='price Heading16B'>$ {parseInt(data?.listprice)?.toLocaleString()}</p>
          </div>
          <div class="bottom">
            <h3 className='Heading16M'>{data?.unparsedaddress}</h3>
            <h3 className='Caption14M mt_2 color-info60'>{(data?.neighbourhood ? (data?.neighbourhood + ' , ') : "") + data?.city}</h3>
            <div class="advants mt_16">
              <p className='Heading13M color-Heading'>
                  {data?.bedroomstotal || 0} Beds, {data?.bathroomstotalinteger || 0} Baths, {data.buildingareatotal || data.livingarea} Sqft
                  {/* {data?.bedroomstotal || 0} Beds, {data?.bathroomstotalinteger || 0} Baths, {parseInput(data.lotsizedimensions)} Sqft */}
              </p>
            </div>
          </div>
        </div>)}
        </>
    }
      </div>
      {state.data.length > 0 && state.map && <div className='w-50 mt_10 googleMapBox'>
      <GoogleMap data={state.data}/>
      </div>
      }
      </div>

    </div>
  )
}

const Marker = ({ text}) => (
    <div className='middle'>
      <SvgIcons.LocationIcon color={'#236A73'} height="30px" width="30px" />
      {<div className="marker-text Heading14M color-Heading bg-color-white pl-2 pr-2 pb-2 pt-2 borderRadius-4 d-flex"><span>$ </span> { text}</div>}
    </div>
  );

function GoogleMap({data}){
    const [hoveredMarker, setHoveredMarker] = useState(null);

  const defaultProps = {
    center: {
      lat: data[0].latitude,
      lng: data[0].longitude
    },
    zoom: 8
  };

  console.log('hoveredMarker ', hoveredMarker)

  function formatNumberWithK(number) {
    if (number < 1000) {
      return number.toString();
    } else if (number >= 1000 && number < 1000000) {
      const formattedNumber = (number / 1000).toFixed(1);
      return formattedNumber.endsWith('.0') ? formattedNumber.slice(0, -2) + 'K' : formattedNumber + 'K';
    } else {
      return number.toString();
    }
  }

  return (
    <div className='h-100 w-100 borderRadius-4 overflow-hidden'>
      <GoogleMapReact
        bootstrapURLKeys = {{ key: "AIzaSyBIUUEUoLYKBnVKGvVjLchBzdMR-CUa5A4" }}
        // apiKey           = {"AIzaSyBIUUEUoLYKBnVKGvVjLchBzdMR-CUa5A4"}
        defaultCenter    = {defaultProps.center}
        defaultZoom      = {defaultProps.zoom}
      >
        {data.map((item, index) => 
        <Marker
            lat          = {item.latitude}
            lng          = {item.longitude}
            text         = {formatNumberWithK(parseInt(item.listprice))}
        />
        )}
      </GoogleMapReact>
    </div>
  );
}