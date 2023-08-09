import React, {useEffect, useState, useRef} from 'react'
import AuthService from '../services/Auth';
import PngIcons from '../icons/png.icon';
import { SvgIcons } from '../icons';
import localforage from 'localforage';
import GoogleMapReact from 'google-map-react';
import { ColorSchemeCode } from '../enums/ColorScheme';
import CustomCheckBox from '../components/CustomCheckBox';
import CustomButton from '../components/CustomButton';
import CustomTextField from '../components/CustomTextField';

export default function HomePage() {

  const [state, setState] = useState({
    loader             : true,
    data               : [],
    map                : false,
    selectedMarkerIndex: null,
    filteredData       : []
  })

  const [filters, setFilters] = useState({
    propertyType : [],
    price : {
      min : 1,
      max : 10000000
    },
    bedrooms: 'any',
    bathrooms: 'any'

  })

  const [show, setShow] = useState({
    modal   : false,
    selected: '',
  })


  function handleMarkerClick(index) {
    // console.log('selectedMarkerIndex ', index)
    setState({ ...state, selectedMarkerIndex: index });
  }

  // Use a ref to access the container element for scrolling
  const containerRef = useRef(null);

  const onLoad = async() => {
    setState({...state, loader : true})
    let data = await localforage.getItem('data');
    if(data){
        setState({...state, data : data, loader : false, filteredData : data})
    }
    let query = {
      ref : 'des54556'
    }
    const {response,error} = await AuthService.GetData({query});
    if(response){
      console.log('response ', response)
      setState({...state, data : response.data, loader : false, filteredData : response.data})
      await localforage.setItem('data', response.data)
    }
    else{
      console.log('error ', error)
      setState({...state, data : [], loader : false, filteredData : []})
    }
  }

  useEffect(()=>{
    onLoad();
  },[])

  useEffect(() => {
    // Scroll to the selected marker when selectedMarkerIndex changes
    if (state.selectedMarkerIndex !== null && containerRef.current) {
      // Use setTimeout to ensure the GoogleMap component has rendered the markers
      setTimeout(() => {
        const markerElement = containerRef.current.querySelector(`[data-id="${state.selectedMarkerIndex}"]`);
        if (markerElement) {
          containerRef.current.scrollTo({
            behavior: 'smooth',
          });
        }
      }, 100); // Adjust the delay as needed
    }
  }, [state.selectedMarkerIndex]);

  const handleClickFunc = (e, event) =>{
    if(show.selected == event){
      setShow({...show, selected : '', modal : false})
    }
    else{
      setShow({...show, selected : event, modal : true})
    }
  }
  
  const propertyTypes = [
    'agriculture',
    'business',
    'industrial',
    'multi-family',
    'retail',
    'single family',
    'vacant land',
  ];
  

  const roomTypes = [
    {key : 'Any', value : 'any'},
    {key : '1+', value : 1},
    {key : '2+', value : 2},
    {key : '3+', value : 3},
    {key : '4+', value : 4},
    {key : '5+', value : 5},
  ]


  const handlePropertyFunc = (property) => {
    const updatedPropertyType = [...filters.propertyType]; // Create a copy of the propertyType array
    const propertyLowercase = property.toLowerCase().trim(); // Transform the property to lowercase and trim
  
    // Check if the property is already in the filter list, and toggle its inclusion
    if (updatedPropertyType.includes(propertyLowercase)) {
      const index = updatedPropertyType.indexOf(propertyLowercase);
      updatedPropertyType.splice(index, 1);
    } else {
      updatedPropertyType.push(propertyLowercase);
    }
  
    setFilters({ ...filters, propertyType: updatedPropertyType });
    setShow({...show, modal : true, selected : 'property'})
  };



  const applyFilters = () => {
    let filteredData = state.data;
  
    // Filter by property type
    if (filters.propertyType.length > 0) {
      filteredData = filteredData.filter((property) =>
        filters.propertyType.includes(property?.propertysubtype?.toLowerCase())
      );
    }
  
    // Filter by price range
    filteredData = filteredData.filter(
      (property) =>
        parseFloat(property.listprice) >= filters.price.min &&
        parseFloat(property.listprice) <= filters.price.max
    );
  
    // Filter by number of bedrooms
    if (filters.bedrooms !== 'any') {
      filteredData = filteredData.filter(
        (property) => parseInt(property.bedroomstotal) >= parseInt(filters.bedrooms)
      );
    }
  
    // Filter by number of bathrooms
    if (filters.bathrooms !== 'any') {
      filteredData = filteredData.filter(
        (property) => parseInt(property.bathroomstotalinteger) >= parseInt(filters.bathrooms)
      );
    }

  
    // Update the state with filtered data
    setState({ ...state, filteredData: filteredData });
    setShow({...show, modal : false, selected : ''})
  };

  useEffect(() => {
    // Function to handle clicks outside the modal
    const handleOutsideClick = (e) => {
      if (show.modal && !e.target.closest('.filterComponentBox')) {
        setShow({ ...show, selected: '', modal: false });
      }
    };
  
    // Add event listener for clicks on the document body
    document.body.addEventListener('click', handleOutsideClick);
  
    // Clean up the event listener when the component unmounts
    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [show]);
  
  

  console.log('state ', state.filteredData  )


  return (
    <div id="HomePage" className='middle'>     
      <div className='container mt_32'>
      <div className='d-flex justify-flex-end w-100 align-items-center mb_32 filterContainer'>
              <div className='singleFilter Heading16M d-flex align-items-center' onClick={(e)=>handleClickFunc(e,'property')}>
                   Property Type <span className='ml_8'><SvgIcons.CustomDropDownReplacedTriangleIcon height={12} width={12}  color={ColorSchemeCode.black}/></span>
                   {(show.modal && (show.selected == "property")) && 
                   <div className='filterComponentBox'>
                        {propertyTypes.map((property)=>
                          <CustomCheckBox 
                            label     = {property}
                            className = {'mt_8 capitalize'}
                            value = {filters.propertyType.includes(property.toLocaleLowerCase()) ? true : false}
                            onChange={()=>handlePropertyFunc(property)}
                        />)}

                        <div className='d-flex justify-flex-end mt_16'>
                          <CustomButton 
                            varient = "secondary"
                            btntext = "Cancel"
                            onClick = {(e)=>handleClickFunc(e,'property')}
                          />
                           <CustomButton 
                            btntext   = "Apply"
                            className={"ml_8"}
                            onClick={applyFilters}
                          />
                        </div>
                   </div>
                   }
                </div>

              <div className='singleFilter Heading16M d-flex align-items-center' onClick={(e)=>handleClickFunc(e,'price')}>
                   Price <span className='ml_8'><SvgIcons.CustomDropDownReplacedTriangleIcon height={12} width={12}  color={ColorSchemeCode.black}/></span>
                {(show.modal && (show.selected == "price")) &&
                   <div className='filterComponentBox'>
                      <div className='d-flex space-between'>
                          <div  className='w-48'>
                            <CustomTextField onClick={(e) => e.stopPropagation()}  label={"Min"} value={filters.price.min} onChange={(e)=>{setFilters({...filters, price : {...filters.price, min : e.target.value}}); e.stopPropagation();}} type="number" top="39px" icon="$" position="start"/>
                          </div>
                          <div  className='w-48'>
                            <CustomTextField onClick={(e) => e.stopPropagation()}  label={"Max"} value={filters.price.max} onChange={(e)=>setFilters({...filters, price : {...filters.price, max : e.target.value}})} top="39px" type="number"  icon="$" position="start"/>
                          </div>
                      </div>
                      <div className='d-flex justify-flex-end mt_16'>
                          <CustomButton 
                            varient = "secondary"
                            btntext = "Cancel"
                            onClick = {(e)=>handleClickFunc(e,'price')}
                          />
                           <CustomButton 
                            btntext   = "Apply"
                            className={"ml_8"}
                            onClick={applyFilters}

                          />
                        </div>
                   </div>
                  }
                </div>
                <div className='singleFilter Heading16M d-flex align-items-center' onClick={(e)=>handleClickFunc(e,'bedrooms')}>
                   No of Bedrooms <span className='ml_8'><SvgIcons.CustomDropDownReplacedTriangleIcon height={12} width={12}  color={ColorSchemeCode.black}/></span>
                   {(show.modal && show.selected == "bedrooms") && 
                   <div className='filterComponentBox'>
                      <div className='d-flex w-100 roomBox' >
                      {
                        roomTypes.map((room)=>
                          <div className={`singleRoom middle ${(room.value == filters.bedrooms) && 'selected'}`} onClick={(e)=>{e.stopPropagation(); setFilters({...filters , bedrooms : room.value})}}>
                              {room.key}
                          </div>
                        )
                      }
                      </div>
                      
                      <div className='d-flex justify-flex-end mt_16'>
                          <CustomButton 
                            varient = "secondary"
                            btntext = "Cancel"
                            onClick = {(e)=>handleClickFunc(e,'bedrooms')}
                          />
                           <CustomButton 
                            btntext   = "Apply"
                            className={"ml_8"}
                            onClick={applyFilters}

                          />
                        </div>
                   </div>
                   }
                </div>
                <div className='singleFilter Heading16M d-flex align-items-center' onClick={(e)=>handleClickFunc(e,'bathrooms')}>
                   No of Bathrooms <span className='ml_8'><SvgIcons.CustomDropDownReplacedTriangleIcon height={12} width={12}  color={ColorSchemeCode.black}/></span>
                   {(show.modal && show.selected == "bathrooms") && 
                   <div className='filterComponentBox'>
                    <div className='d-flex w-100 roomBox'>
                      {
                        roomTypes.map((room)=>
                          <div className={`singleRoom middle ${(room.value == filters.bathrooms) && 'selected'}`} onClick={(e)=>{e.stopPropagation(); setFilters({...filters , bathrooms : room.value})}}>
                              {room.key}
                          </div>
                        )
                      }
                      </div>
                      <div className='d-flex justify-flex-end mt_16'>
                          <CustomButton 
                            varient = "secondary"
                            btntext = "Cancel"
                            onClick = {(e)=>handleClickFunc(e,'bathrooms')}
                          />
                           <CustomButton 
                            btntext   = "Apply"
                            className={"ml_8"}
                            onClick={applyFilters}

                          />
                        </div>
                   </div>
                   }
                </div>
            <div className='d-flex justify-flex-end mapIcons'>
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
      </div>
      <div className={`mainContainer d-flex h-100vh overflow-scroll w-100  ${state.map && 'paddingFix'}`}>
      <div class={`container ${state.map && 'w-50'}`}>
        
        {state.loader ? <img className='absoluteMiddle' src={PngIcons.loader} width="50px" height={"auto"} alt="" />  : 
        <>
     
        {state.filteredData && state?.filteredData.map((data, idx)=>
        <div class={`box ${state.map && 'twoBoxes'} `}>
          <div class="top">
            <img className='object-fit-cover' src={data?.media[0]?.MediaURL} alt="" height={"165px"} width="100%" />
            <p className='price Heading16B'>$ {parseInt(data?.listprice)?.toLocaleString()}</p>
          </div>
          <div class="bottom">
            <h3 className='Heading16M'>{data?.unparsedaddress}</h3>
            <h3 className='Caption14M mt_2 color-info60'>{(data?.neighbourhood ? (data?.neighbourhood + ' , ') : "") + data?.city}</h3>
            <div class="advants mt_16">
              <p className='Heading13M color-Heading'>
                  {data?.bedroomstotal || 0} Beds, {data?.bathroomstotalinteger || 0} Baths, {data.buildingareatotal || data.livingarea} Sqft
              </p>
            </div>
          </div>
        </div>)}
        </>
    }
      </div>
      {state.data.length > 0 && state.map && <div className='w-50 mt_10 googleMapBox'>
      <GoogleMap data={state.data} onMarkerClick={handleMarkerClick}/>
      </div>
      }
      </div>

    </div>
  )
}

const Marker = ({ text, index, onMarkerClick}) => (
    <div data-id={index} className='middle' onClick={onMarkerClick}>
      <SvgIcons.LocationIcon color={'#236A73'} height="30px" width="30px" />
      {<div className="marker-text Heading14M color-Heading bg-color-white pl-2 pr-2 pb-2 pt-2 borderRadius-4 d-flex"><span>$ </span> { text}</div>}
    </div>
  );

function GoogleMap({data, onMarkerClick}){
  const defaultProps = {
    center: {
      lat: data[0].latitude,
      lng: data[0].longitude
    },
    zoom: 8
  };

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
        defaultCenter    = {defaultProps.center}
        defaultZoom      = {defaultProps.zoom}
      >
        {data.map((item, index) => 
        <Marker
            lat           = {item.latitude}
            lng           = {item.longitude}
            index         = {index}
            onMarkerClick = {()=>onMarkerClick(index)}
            text          = {formatNumberWithK(parseInt(item.listprice))}
        />
        )}
      </GoogleMapReact>
    </div>
  );
}