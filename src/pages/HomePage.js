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
import CustomsModal from './../components/CustomModal';

export default function HomePage() {

  const [state, setState] = useState({
    loader             : true,
    data               : [],
    map                : false,
    selectedMarkerIndex: null,
    filteredData       : [],
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
    setState({ ...state, selectedMarkerIndex: index });
  }

  // Use a ref to access the container element for scrolling
  const containerRef = useRef(null);

  const onLoad = async() => {
    setState({...state, loader : true})
    let data = await localforage.getItem('data');
    // if(data){
    //     setState({...state, data : data, loader : false, filteredData : data})
    // }
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
      <div class={`container ${state.map && 'w-50 mt_430'}`}>
        
        {state.loader ? <img className='absoluteMiddle' src={PngIcons.loader} width="50px" height={"auto"} alt="" />  : 
        <>
     
        {state.filteredData && state?.filteredData.map((data, idx)=>
        <div class={`box ${state.map && 'twoBoxes'} `} onClick={()=>setState({...state, selectedMarkerIndex : idx})}>
          <div class="top">
            <img className='object-fit-cover coverImg' src={data?.media[0]?.MediaURL} alt="" height={"185px"} width="100%" />
            <p className='price Heading16B'>{data?.listprice ? `$ ${parseInt(data?.listprice)?.toLocaleString()}` : 'N/A'}</p>
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
    {console.log('state ', state.selectedMarkerIndex)}
      </div>
      {state.data.length > 0 && state.map && <div className='w-50 mt_10 googleMapBox'>
      <GoogleMap data={state.filteredData} onMarkerClick={handleMarkerClick}/>
      </div>
      }
      </div>
      <CustomsModal 
        open={(state.selectedMarkerIndex == 0  || state.selectedMarkerIndex) ? true : false}
        onClose={()=>setState({...state, selectedMarkerIndex : null})}
        component={
        <ModalComponent 
          onClose={()=>setState({...state, selectedMarkerIndex : null})}
          state = {state}
          />
        }
        minWidth={"100%"}
      />
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


const ModalComponent = ({onClose, state}) =>{
  return(
    <div className='position-relative'>
        <div className='d-flex justify-flex-end' style={{left : '0px', top: '0px', position: 'sticky', zIndex: 1000}} onClick={()=>onClose()}>
            <SvgIcons.CrossIcon className="cp" color={ColorSchemeCode.black}/>
        </div>
        <div className='row flexDirection'>
          <div className='col-md-7 col-12 col-lg-12 col-xl-7 leftModalSection'>
            <img className='w-100 mb_16 modalImages' height={500} src={state?.filteredData[state?.selectedMarkerIndex]?.media[0]?.MediaURL} />
            <div className='d-flex flex-wrap space-between'>
                {state?.filteredData[state?.selectedMarkerIndex]?.media.map((singleImge, idx)=>singleImge.MediaCategory == "Property Photo" && idx > 1 && <img className={`modalImages  object-fit-cover ${(idx == state?.filteredData[state?.selectedMarkerIndex]?.media?.length-1 && (state?.filteredData[state?.selectedMarkerIndex]?.media %2 == 0) && singleImge.MediaCategory == "Property Photo" )  ? 'w-100' : 'w-49' } mb_16`} height={247} src={singleImge?.MediaURL} />)}
            </div>
          </div>
          <div className='col-md-5 col-12 col-lg-12 col-xl-5 rightModalSection'>
              <p className='price Heading28B mb_8 d-flex align-items-center'>{state?.filteredData[state?.selectedMarkerIndex]?.listprice ? `$ ${parseInt(state?.filteredData[state?.selectedMarkerIndex]?.listprice)?.toLocaleString()}` : 'N/A'}
              <p className='Heading15M color-Heading pt_10 ml_16'>
                  {state?.filteredData[state?.selectedMarkerIndex]?.bedroomstotal || 0} Bd | {state?.filteredData[state?.selectedMarkerIndex]?.bathroomstotalinteger || 0} Ba | {state?.filteredData[state?.selectedMarkerIndex]?.buildingareatotal || (state?.filteredData[state?.selectedMarkerIndex]?.livingarea || 0)} Sqft
              </p>
            </p>
            <h3 className='Heading18M'>{state?.filteredData[state?.selectedMarkerIndex]?.unparsedaddress}
            </h3>
            <h3 className='Caption16M mt_2 color-info60'>{(state?.filteredData[state?.selectedMarkerIndex]?.neighbourhood ? (state?.filteredData[state?.selectedMarkerIndex]?.neighbourhood + ' , ') : "") + state?.filteredData[state?.selectedMarkerIndex]?.city}</h3>
          
            
            <h3 className='Heading20B mt_32 mb_8'>Details:</h3>
            <div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Address : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content capitalize'>{state?.filteredData[state?.selectedMarkerIndex]?.unparsedaddress + ', ' + state?.filteredData[state?.selectedMarkerIndex]?.stateorprovince +  ', ' + state?.filteredData[state?.selectedMarkerIndex]?.country + ', ' + state?.filteredData[state?.selectedMarkerIndex]?.postalcode }</h3>
            </div>
            <div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Property Type : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.propertysubtype}</h3>
            </div>
            <div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>MLS® : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.listingid}</h3>
            </div>

            {state?.filteredData[state?.selectedMarkerIndex]?.parkingtotal &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Parking Spots : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.parkingtotal}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.parkingfeatures?.length > 1 &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Parking Type : </h3>
              <h3 className='Body14R mt_2 mb_4  w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.parkingfeatures}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.yearbuilt &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Year Built : </h3>
              <h3 className='Body14R mt_2 mb_4  w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.yearbuilt}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.fireplacestotal &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Fireplaces : </h3>
              <h3 className='Body14R mt_2 mb_4  w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.fireplacestotal}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.heating?.length > 0 &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Heating : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.heating || 'N/A'}</h3>
            </div>}

              {state?.filteredData[state?.selectedMarkerIndex]?.colling?.length > 0 &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Cooling : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.colling || 'N/A'}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.flooring?.length > 0 &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Flooring : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.flooring}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.taxannualamount > 0 && 
            <div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Gross Property Tax : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>${state?.filteredData[state?.selectedMarkerIndex]?.taxannualamount}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.structuretype &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Structure Type : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.structuretype}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.watersource?.length > 0 &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Water Source : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.watersource}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.sewer?.length > 0 &&<div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Sewer Type : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.sewer}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.commoninterest && <div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Ownership Type : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.commoninterest}</h3>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.condofee && <div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Condo Fees : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.condofee + ' ' + state?.filteredData[state?.selectedMarkerIndex]?.associationfeefrequency}</h3>
            </div>}
            {state?.filteredData[state?.selectedMarkerIndex]?.associationfeeincludes?.length > 1 && <div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Condo Fees Includes : </h3>
              <div className='w-60 Body14R content d-flex flex-wrap'>
                {state?.filteredData[state?.selectedMarkerIndex]?.associationfeeincludes?.map((feature, idx)=><span className='Body14R'>{feature}  {(idx < state?.filteredData[state?.selectedMarkerIndex]?.appliances?.length-1) && ','}</span>)}
              </div>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.lotsizedimensions && state?.filteredData[state?.selectedMarkerIndex]?.lotsizeunits  && <div className='d-flex'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Lot Dimensions : </h3>
              <h3 className='Body14R mt_2 mb_4 w-60 content'>{state?.filteredData[state?.selectedMarkerIndex]?.lotsizedimensions + ' ' + state?.filteredData[state?.selectedMarkerIndex]?.lotsizeunits}</h3>
            </div>}
            
           

            {state?.filteredData[state?.selectedMarkerIndex]?.communityfeatures?.length > 0 && <div className='d-flex flex-wrap mb_8'>
              <h3 className='Body14M w-40 labelName'>Community Features : </h3>
              <div className='d-flex flex-wrap w-60 content'>
                {state?.filteredData[state?.selectedMarkerIndex]?.communityfeatures?.map((feature)=><h3 className='Body14R'>{feature}</h3>)}
              </div>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.securityfeatures?.length > 0 && <div className='mt_8 d-flex flex-wrap mb_8'>
              <h3 className='Body14M w-40 labelName'>Security Features : </h3>
                <div className='d-flex flex-wrap content w-60' >
                  {state?.filteredData[state?.selectedMarkerIndex]?.securityfeatures?.map((feature,idx)=><span className='Body14R'>{feature} {(idx < state?.filteredData[state?.selectedMarkerIndex]?.securityfeatures?.length-1) && ','}</span>)}
                </div>            
            </div>}


            {state?.filteredData[state?.selectedMarkerIndex]?.fireplacefeatures?.length > 0 && <div className='d-flex flex-wrap mb_8'>
              <h3 className='Body14M w-40 labelName'>Security Features : </h3>
              <div className='d-flex w-60 flex-wrap content'>
                {state?.filteredData[state?.selectedMarkerIndex]?.fireplacefeatures?.map((feature,idx)=><span className='Body14R'>{feature} {(idx < state?.filteredData[state?.selectedMarkerIndex]?.securityfeatures?.length-1) && ','}</span>)}
              </div>
            </div>}
            
            
            
            {state?.filteredData[state?.selectedMarkerIndex]?.appliances?.length > 0 && <div className='d-flex flex-wrap mb_8'>
              <h3 className='Body14M w-40 labelName'>Appliances : </h3>
              <div className='d-flex w-60 flex-wrap content'>
                {state?.filteredData[state?.selectedMarkerIndex]?.appliances?.map((feature, idx)=><span className='Body14R'>{feature}  {(idx < state?.filteredData[state?.selectedMarkerIndex]?.appliances?.length-1) && ','}</span>)}
              </div>
            </div>}

            {state?.filteredData[state?.selectedMarkerIndex]?.lotfeatures?.length > 0 && <div className='d-flex flex-wrap mb_8'>
              <h3 className='Body14M mt_2 mb_4 w-40 labelName'>Lot Features : </h3>
              {state?.filteredData[state?.selectedMarkerIndex]?.lotfeatures?.map((feature)=><h3 className='Body14R lotFeature mt_2 mb_4'>{feature}</h3>)}
            </div>}

            

            <h3 className='Heading20B mt_32 mb_8'>Overview:</h3>
            <div className='d-flex'>
              <h3 className='Body14R mt_2 mb_4 word-break text-align-justify'>{state?.filteredData[state?.selectedMarkerIndex]?.publicremarks}</h3>
            </div>

          </div>

        </div>
        {/* {state?.filteredData[state?.selectedMarkerIndex]?.listprice}/ */}
        {console.log('selected ', state?.filteredData[state?.selectedMarkerIndex])}
    </div>
  )
}