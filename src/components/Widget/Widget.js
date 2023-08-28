import React, {useEffect, useState, useRef} from 'react'
import AuthService from '../../services/Auth';
import localforage from 'localforage';
import GoogleMapReact from 'google-map-react';
import CustomCheckBox from '../CustomCheckBox';
import CustomButton from '../CustomButton';
import CustomTextField from '../CustomTextField';
import CryptoJS from 'crypto-js';

import toast, { Toaster } from 'react-hot-toast';

import './widget.css'
import './global.css'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

export default function Widget() {

  const [state, setState] = useState({
    loader             : true,
    data               : [],
    map                : false,
    selectedMarkerIndex: null,
    filteredData       : [],
    filterApplied  : false,
  })

  const filterInitialValues = {
    propertyType : [],
    price : {
      min : 1,
      max : 10000000
    },
    bedrooms: 'any',
    bathrooms: 'any'
  }

  const [filters, setFilters] = useState({
    ...filterInitialValues,
  })

  const [show, setShow] = useState({
    modal   : false,
    selected: '',
    contactModal : false,
    emailLoader : false,
    emailSent : false,
  })

  const [emailDetails, setEmailDetails] = useState({
    name : '',
    email : '',
    message : '',
    phone : '',
    to : '',
  })


  function handleMarkerClick(index) {
    setState({ ...state, selectedMarkerIndex: index });
  }

  // Use a ref to access the container element for scrolling
  const containerRef = useRef(null);

  const handleDecrypt = (key) => {
    try {
      const secretKey = 'X1A-PrXcVlQ4F'; // Replace with your actual secret key
      const decrypted = CryptoJS.AES.decrypt(key, secretKey).toString(
        CryptoJS.enc.Utf8
      );
      console.log('decrypted ', decrypted)
      return decrypted
    } catch (error) {
      return ""
    }
  };

  const onLoad = async() => {
    setState({...state, loader : true})
      let query = {};
      let dataConfigAttr;
  
      const scriptElement = document.querySelector('#Simple-Widget-Script');
      if (scriptElement) {
        dataConfigAttr = scriptElement.getAttribute('data-id');
        setEmailDetails({...emailDetails, to : scriptElement.getAttribute('email')})
      }
  
      let dbRef = handleDecrypt(dataConfigAttr)
      console.log('dbRef ', dbRef)
      // query.ref = dbRef || 'des54556'
      query.ref = dbRef
  
      // des54556
  
      const {response,error} = await AuthService.GetData({query});
      if(response){
        console.log('response ', response.data[0])
        let filteredByPrice = await response.data.sort((a, b) => {
          const priceA = parseFloat(a?.listprice) || 0;
          const priceB = parseFloat(b?.listprice) || 0;
          return priceB - priceA;
      });
  
       filteredByPrice.forEach((data)=>{
       })
        setState({...state, data : filteredByPrice, loader : false, filteredData : filteredByPrice})
        await localforage.setItem('data', filteredByPrice)
      }
      else{
        console.log('error ', error)
        setState({...state, data : [], loader : false, filteredData : []})
      } 
  }

  useEffect(()=>{
    onLoad();
  },[])

  function capitalizeWords(str) {
    // Split the input string into an array of words
   if(str){
    const words = str?.split(' ') || "";
  
    // Capitalize the first letter of each word and join them back together
    const capitalizedWords = words.map(word => {
      if (word.length > 0) {
        return word[0].toUpperCase() + word.slice(1);
      } else {
        return word; // Handle empty words, if any
      }
    });
  
    // Join the capitalized words into a string
    return capitalizedWords.join(' ');
   }
  }
  
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

    setEmailDetails({...emailDetails , message : `I am interested in ${capitalizeWords(state?.data[state?.selectedMarkerIndex]?.unparsedaddress)}, ${(state?.data[state?.selectedMarkerIndex]?.neighbourhood ? (state?.data[state?.selectedMarkerIndex]?.neighbourhood + ' , ') : "") + state?.data[state?.selectedMarkerIndex]?.city}.`})

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
  
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShow({ ...state, contactModal: false, emailSent : false  });
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    let filterApplied = false;
    // Filter by property type
    if (filters.propertyType.length > 0) {
      filteredData = filteredData.filter((property) =>
        filters.propertyType.includes(property?.propertysubtype?.toLowerCase())
      );
      filterApplied=true;
    }
  
    // Filter by price range
    if(filters.price.min || filters.price.max){
      filteredData = filteredData.filter(
        (property) =>
          parseFloat(property.listprice) >= filters.price.min &&
          parseFloat(property.listprice) <= filters.price.max
      );
      filterApplied=true;
    }

  
    // Filter by number of bedrooms
    if (filters.bedrooms !== 'any') {
      filteredData = filteredData.filter(
        (property) => parseInt(property.bedroomstotal) >= parseInt(filters.bedrooms)
      );
      filterApplied=true;
    }
  
    // Filter by number of bathrooms
    if (filters.bathrooms !== 'any') {
      filteredData = filteredData.filter(
        (property) => parseInt(property.bathroomstotalinteger) >= parseInt(filters.bathrooms)
      );
        filterApplied = true
    }

    // Update the state with filtered data
    setState({ ...state, filteredData: filteredData, filterApplied : filterApplied });
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

  const sendEmailFunc = async() => {
    setShow({...show, emailLoader : true, emailSent : false})

    let toEmail = "";
  
    const scriptElement = document.querySelector('#Simple-Widget-Script');
    if (scriptElement) {
      toEmail  = scriptElement.getAttribute('email')
    }

    console.log('toEmail ', toEmail)

    try {
      const response = await axios.post('https://embed.realestateintegrate.com/api/send-email', {...emailDetails, to : toEmail, mls : state?.data[state?.selectedMarkerIndex]?.listingid});
      console.log('Response:', response.data);
      setShow({...show, emailSent : true, emailLoader : false})
      setEmailDetails({firstName : '', lastName : '', email : '', phone : '', message : ''})
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error while sending email')
     setShow({...show, emailLoader : false})
    }
  }
  

  return (
    <div id="HomePage" className='middle'>     
      <div className='container mt_32'>
      <div className='d-flex justify-flex-end w-100 align-items-center mb_32 justify-content-center filterContainer'>
              <div className='singleFilter Heading16M d-flex align-items-center' onClick={(e)=>handleClickFunc(e,'property')}>
                   Property Type
                   <span className='ml_8'>
                    <svg width="12" height="12" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.625 1.625L4 4.25L1.375 1.625" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                   </span>
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
                   Price
                   <span className='ml_8'>
                    <svg width="12" height="12" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.625 1.625L4 4.25L1.375 1.625" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                   </span>
                {(show.modal && (show.selected == "price")) &&
                   <div className='filterComponentBox'>
                      <div className='d-flex space-between'>
                          <div  className='w-48'>
                            <CustomTextField onClick={(e) => e.stopPropagation()}  label={"Min"} value={filters.price.min} onChange={(e)=>{setFilters({...filters, price : {...filters.price, min : e.target.value}}); e.stopPropagation();}} type="number" top="42px" icon="$" position="start"/>
                          </div>
                          <div  className='w-48'>
                            <CustomTextField onClick={(e) => e.stopPropagation()}  label={"Max"} value={filters.price.max} onChange={(e)=>setFilters({...filters, price : {...filters.price, max : e.target.value}})} top="42px" type="number"  icon="$" position="start"/>
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
                   No of Bedrooms
                   <span className='ml_8'>
                    <svg width="12" height="12" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.625 1.625L4 4.25L1.375 1.625" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                   </span>
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
                   No of Bathrooms
                   <span className='ml_8'>
                    <svg width="12" height="12" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.625 1.625L4 4.25L1.375 1.625" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                   </span>
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
                {state.filterApplied && <div className='d-flex align-items-center  cp' onClick={()=>{setFilters({...filterInitialValues}); setState({...state, filterApplied : false, filteredData : state.data})}}>
                    <span className='Heading15M color-Heading ml_4' style={{color : 'red'}}>Reset Filters</span>
                </div>}
                </div>
                <div className='d-flex justify-flex-end tileIcons'>
                  <div className='d-flex align-items-center marginFix cp' style={{marginLeft : '20px'}} onClick={()=>setState({...state, map : false})}>
                      <span className='Heading15M color-Heading ml_4'>Tile</span>
                  </div>
                  <div className='d-flex align-items-center ml_20 cp' onClick={()=>setState({...state, map : true})}>
                  <svg height="15px" width="15px" fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg>
                      <span className='Heading15M color-Heading ml_4'>Map</span>
                  </div>
                </div>
        </div>
      </div>
      <div className={`mainContainer d-flex h-100vh overflow-scroll ${(state.filteredData.length <= 10 || state.filteredData.length == 0) && 'w-100'}  ${state.map && 'paddingFix'}`}>
      <div class={`MainBox ${state.map && 'w-50 mt_430'}`}>
        
        {state.loader ? 
        <h3 className='text-center w-100'></h3>
        :
        <>
     
        {state.filteredData?.length > 0  ? state?.filteredData.map((data, idx)=>
        <div class={`box ${state.map && 'twoBoxes'} `} onClick={()=>setState({...state, selectedMarkerIndex : idx})}>
          <div class="top">
            <img className='object-fit-cover coverImg' src={data?.media[0]?.MediaURL} alt="" height={"185px"} width="100%" />
            <p className='price Heading16B'>{data?.listprice ? `$ ${parseInt(data?.listprice)?.toLocaleString()}` : 'N/A'}</p>
          </div>
          <div class="bottom">
            <h3 className='Heading16M'>{capitalizeWords(data?.unparsedaddress)}</h3>
            <h3 className='Heading10on142M mt_2 color-info60'>{(data?.neighbourhood ? (data?.neighbourhood + ' , ') : "") + data?.city}</h3>
            <div class="advants mt_16">
              <p className='Heading13M color-Heading d-flex'>
                  {data?.bedroomstotal && data?.bedroomstotal != "0" && <span>
                    {" "+ data?.bedroomstotal + ' Bed, '}
                  </span>}
                  {data?.bathroomstotalinteger && data?.bathroomstotalinteger != "0" && <span>
                  &nbsp;{+ data?.bathroomstotalinteger +  ' Baths, '}
                  </span>}
                  {(data.buildingareatotal || data.livingarea) && (data.buildingareatotal || data.livingarea) != "0" && <span>
                  &nbsp;{(data.buildingareatotal || data.livingarea)  + ' Sqft'}
                  </span>}
              </p>
            </div>
          </div>
        </div>)

        :

        <h3 className='Heading22M w-100 middle'>
            No Matching Results Found!!!
        </h3>
        
        }
        </>
    }
      </div>
      {state.data.length > 0 && state.map && <div className='w-50 mt_10 googleMapBox'>
      <GoogleMap state={state} setState={setState} data={state.filteredData} onMarkerClick={handleMarkerClick}/>
      </div>
      }
      </div>
      {(state.selectedMarkerIndex == 0  || state.selectedMarkerIndex) && 
         <div className="modal-example position-fixed">
         <div className={`modal-overlay ${state.selectedMarkerIndex ? 'open' : ''}`}>
          <div className="modal-content">
            <div className='position-relative'>
                <div className='d-flex justify-flex-end cp' style={{left : '0px', top: '0px', position: 'sticky', zIndex: 1000}} onClick={()=>setState({...state, selectedMarkerIndex : null})}>
                <svg class="cp" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.560261 0.578556C0.705802 0.433506 0.903091 0.352034 1.10879 0.352034C1.31449 0.352034 1.51178 0.433506 1.65732 0.578556L4.9899 3.90399L8.32247 0.578556C8.39354 0.502456 8.47923 0.441419 8.57445 0.399085C8.66966 0.35675 8.77245 0.333987 8.87667 0.332152C8.9809 0.330317 9.08442 0.349448 9.18107 0.388404C9.27773 0.42736 9.36553 0.485343 9.43923 0.558894C9.51294 0.632445 9.57105 0.720056 9.61009 0.816502C9.64913 0.912948 9.6683 1.01625 9.66646 1.12025C9.66463 1.22425 9.64181 1.32682 9.59939 1.42183C9.55696 1.51684 9.49579 1.60235 9.41953 1.67326L6.08696 4.9987L9.41953 8.32413C9.49579 8.39504 9.55696 8.48055 9.59939 8.57556C9.64181 8.67058 9.66463 8.77314 9.66646 8.87714C9.6683 8.98114 9.64913 9.08445 9.61009 9.18089C9.57105 9.27734 9.51294 9.36495 9.43923 9.4385C9.36553 9.51205 9.27773 9.57003 9.18107 9.60899C9.08442 9.64795 8.9809 9.66708 8.87667 9.66524C8.77245 9.66341 8.66966 9.64064 8.57445 9.59831C8.47923 9.55598 8.39354 9.49494 8.32247 9.41884L4.9899 6.09341L1.65732 9.41884C1.51017 9.55566 1.31555 9.63014 1.11446 9.6266C0.913365 9.62306 0.721498 9.54177 0.579281 9.39986C0.437064 9.25795 0.3556 9.06649 0.352052 8.86583C0.348504 8.66516 0.423149 8.47096 0.560261 8.32413L3.89284 4.9987L0.560261 1.67326C0.4149 1.52803 0.333252 1.33117 0.333252 1.12591C0.333252 0.920651 0.4149 0.723786 0.560261 0.578556Z" fill="#000000"></path></svg>
                </div>
                <div className='row flexDirection'>
                  <div className='col-md-7 col-12 col-lg-12 col-xl-7 leftModalSection'>
                    <img className='w-100 mb_16 modalImages' height={500} src={state?.data[state?.selectedMarkerIndex]?.media[0]?.MediaURL} />
                    <div className='d-flex flex-wrap space-between'>
                        {state?.data[state?.selectedMarkerIndex]?.media.map((singleImge, idx)=>singleImge.MediaCategory == "Property Photo" && idx > 1 && <img className={`modalImages  object-fit-cover ${(idx == state?.data[state?.selectedMarkerIndex]?.media?.length-1 && (state?.data[state?.selectedMarkerIndex]?.media %2 == 0) && singleImge.MediaCategory == "Property Photo" )  ? 'w-100' : 'w-49' } mb_16`} height={247} src={singleImge?.MediaURL} />)}
                    </div>
                  </div>
                  <div className='col-md-5 col-12 col-lg-12 col-xl-5 rightModalSection'>
                      <p className='mainPrice Heading28B mb_8 d-flex align-items-center'>{state?.data[state?.selectedMarkerIndex]?.listprice ? `$${parseInt(state?.data[state?.selectedMarkerIndex]?.listprice)?.toLocaleString()}` : 'N/A'}
                      <p className='Heading15M color-Heading d-flex pt_10 ml_16'>
                          {state?.data[state?.selectedMarkerIndex]?.bedroomstotal && state?.data[state?.selectedMarkerIndex]?.bedroomstotal != "0" && <span>
                            {" "+ state?.data[state?.selectedMarkerIndex]?.bedroomstotal + ' Bed, '}
                          </span>}
                          {state?.data[state?.selectedMarkerIndex]?.bathroomstotalinteger && state?.data[state?.selectedMarkerIndex]?.bathroomstotalinteger != "0" && <span>
                          &nbsp;{+ state?.data[state?.selectedMarkerIndex]?.bathroomstotalinteger +  ' Baths, '}
                          </span>}
                          {(state?.data[state?.selectedMarkerIndex]?.buildingareatotal || state?.data[state?.selectedMarkerIndex]?.livingarea) && (state?.data[state?.selectedMarkerIndex]?.buildingareatotal || state?.data[state?.selectedMarkerIndex]?.livingarea) != "0" && <span>
                          &nbsp;{(state?.data[state?.selectedMarkerIndex]?.buildingareatotal || state?.data[state?.selectedMarkerIndex]?.livingarea)  + ' Sqft'}
                          </span>}
                      </p>

                    </p>
                    <h3 className='Heading18M text-left'>{capitalizeWords(state?.data[state?.selectedMarkerIndex]?.unparsedaddress)}
                    </h3>
                    <h3 className='Heading16M text-left mt_2 color-info60'>{(state?.data[state?.selectedMarkerIndex]?.neighbourhood ? (state?.data[state?.selectedMarkerIndex]?.neighbourhood + ' , ') : "") + state?.data[state?.selectedMarkerIndex]?.city}</h3>
                  
                    <div className='d-flex justify-flex-start mt_24 mb_8'>
                      <CustomButton 
                        btntext={"Contact Agent"}
                        onClick={()=>setShow({...show, contactModal : true})}
                      />
                    </div>


                    <h3 className='Heading20B mt_32 mb_8 text-left'>Details:</h3>
                    <div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Address: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content capitalize'>{capitalizeWords(state?.data[state?.selectedMarkerIndex]?.unparsedaddress) + ', ' + state?.data[state?.selectedMarkerIndex]?.stateorprovince +  ', ' + state?.data[state?.selectedMarkerIndex]?.country + ', ' + state?.data[state?.selectedMarkerIndex]?.postalcode }</h3>
                    </div>
                    <div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Property Type: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.propertysubtype}</h3>
                    </div>
                    <div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>MLS®: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.listingid}</h3>
                    </div>

                    {state?.data[state?.selectedMarkerIndex]?.parkingtotal &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Parking Spots: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.parkingtotal}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.parkingfeatures?.length > 1 &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Parking Type: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4  w-60 content'>{state?.data[state?.selectedMarkerIndex]?.parkingfeatures}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.yearbuilt &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Year Built: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4  w-60 content'>{state?.data[state?.selectedMarkerIndex]?.yearbuilt}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.fireplacestotal &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Fireplaces: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4  w-60 content'>{state?.data[state?.selectedMarkerIndex]?.fireplacestotal}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.heating?.length > 0 &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Heating: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                        {state?.data[state?.selectedMarkerIndex]?.heating?.map((feature, idx) => (
                          <span className='Body14R' style={{marginRight: '3px', textAlign : 'left'}}>
                            {feature}{idx < state?.data[state?.selectedMarkerIndex]?.heating?.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>}

                      {state?.data[state?.selectedMarkerIndex]?.colling?.length > 0 &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Cooling: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                        {state?.data[state?.selectedMarkerIndex]?.colling?.map((feature, idx) => (
                          <span className='Body14R' style={{marginRight: '3px', textAlign : 'left'}}>
                            {feature}{idx < state?.data[state?.selectedMarkerIndex]?.colling?.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.flooring?.length > 0 &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Flooring: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                        {state?.data[state?.selectedMarkerIndex]?.flooring?.map((feature, idx) => (
                          <span className='Body14R' style={{marginRight: '3px', textAlign : 'left'}}>
                            {feature}{idx < state?.data[state?.selectedMarkerIndex]?.flooring?.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.taxannualamount > 0 && 
                    <div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Gross Property Tax: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>${state?.data[state?.selectedMarkerIndex]?.taxannualamount}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.structuretype?.length > 0 &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Structure Type: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.structuretype}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.watersource?.length > 0 &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Water Source: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.watersource}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.sewer?.length > 0 &&<div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Sewer Type: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.sewer}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.commoninterest && <div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Ownership Type: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.commoninterest}</h3>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.condofee && <div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Condo Fees: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.condofee + ' ' + state?.data[state?.selectedMarkerIndex]?.associationfeefrequency}</h3>
                    </div>}
                    {state?.data[state?.selectedMarkerIndex]?.associationfeeincludes?.length > 1 && <div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Condo Fees Includes: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                        {state?.data[state?.selectedMarkerIndex]?.associationfeeincludes?.map((feature, idx) => (
                          <span className='Body14R' style={{marginRight: '3px', textAlign : 'left'}}>
                            {feature}{idx < state?.data[state?.selectedMarkerIndex]?.associationfeeincludes?.length - 1 ? ', ' : ' '}
                          </span>
                        ))}
                      </div>   
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.lotsizedimensions && state?.data[state?.selectedMarkerIndex]?.lotsizeunits  && <div className='d-flex'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Lot Dimensions: </h3>
                      <h3 className='Body14R text-left mt_2 mb_4 w-60 content'>{state?.data[state?.selectedMarkerIndex]?.lotsizedimensions + ' ' + state?.data[state?.selectedMarkerIndex]?.lotsizeunits}</h3>
                    </div>}
                    
                  

                    {state?.data[state?.selectedMarkerIndex]?.communityfeatures?.length > 0 && <div className='d-flex flex-wrap mb_8'>
                      <h3 className='Body14M text-left w-40 labelName'>Community Features: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                        {state?.data[state?.selectedMarkerIndex]?.communityfeatures?.map((feature, idx) => (
                          <span className='Body14R' style={{marginRight: '3px', textAlign : 'left'}}>
                            {feature}{idx < state?.data[state?.selectedMarkerIndex]?.communityfeatures?.length - 1 ? ', ' : ' '}
                          </span>
                        ))}
                      </div>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.securityfeatures?.length > 0 && <div className='mt_8 d-flex flex-wrap mb_8'>
                      <h3 className='Body14M text-left w-40 labelName'>Security Features: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                        {state?.data[state?.selectedMarkerIndex]?.securityfeatures?.map((feature, idx) => (
                          <span className='Body14R' style={{marginRight: '3px', textAlign : 'left'}}>
                            {feature}{idx < state?.data[state?.selectedMarkerIndex]?.securityfeatures?.length - 1 ? ', ' : ' '}
                          </span>
                        ))}
                      </div>          
                    </div>}


                    {state?.data[state?.selectedMarkerIndex]?.fireplacefeatures?.length > 0 && <div className='d-flex flex-wrap mb_8'>
                      <h3 className='Body14M text-left w-40 labelName'>Security Features: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                        {state?.data[state?.selectedMarkerIndex]?.fireplacefeatures?.map((feature, idx) => (
                          <span className='Body14R' style={{marginRight: '3px', textAlign : 'left'}}>
                            {feature}{idx < state?.data[state?.selectedMarkerIndex]?.fireplacefeatures?.length - 1 ? ', ' : ' '}
                          </span>
                        ))}
                      </div>
                    </div>}
                    
                    
                    
                    {state?.data[state?.selectedMarkerIndex]?.appliances?.length > 0 && <div className='d-flex flex-wrap mb_8'>
                      <h3 className='Body14M text-left w-40 labelName'>Appliances: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                        {state?.data[state?.selectedMarkerIndex]?.appliances?.map((feature, idx) => (
                          <span className='Body14R' style={{marginRight: '3px', textAlign : 'left'}}>
                            {feature}{idx < state?.data[state?.selectedMarkerIndex]?.appliances?.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>}

                    {state?.data[state?.selectedMarkerIndex]?.lotfeatures?.length > 0 && <div className='d-flex flex-wrap mb_8'>
                      <h3 className='Body14M text-left mt_2 mb_4 w-40 labelName'>Lot Features: </h3>
                      <div className='d-flex w-60 flex-wrap content'>
                      {state?.data[state?.selectedMarkerIndex]?.lotfeatures?.map((feature)=><h3 className='Body14R lotFeature mt_2 mb_4'>{feature}</h3>)}
                      </div>
                    </div>}

                    <h3 className='Heading20B text-left mt_32 mb_8'>Overview:</h3>
                    <div className='d-flex descriptionText'>
                      <h3 className='Body14R  mt_2 mb_4 word-break text-align-justify' style={{paddingBottom : '50px'}}>{state?.data[state?.selectedMarkerIndex]?.publicremarks}</h3>
                    </div>

                  </div>
                </div>
            </div>
          </div>
         </div>
        </div>
      }
      { show.contactModal && 
        <div  className="contact-modal-example position-fixed">
          <div  className='contact-modal-overlay'>
           <div ref={modalRef}  className="contact-modal-content">
          
           <div className='position-relative'>
               <div className='d-flex justify-flex-end cp' style={{left : '0px', top: '0px', position: 'sticky', zIndex: 1000}} onClick={()=>setShow({...state, contactModal  : false, emailSent : false})}>
               <svg class="cp" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.560261 0.578556C0.705802 0.433506 0.903091 0.352034 1.10879 0.352034C1.31449 0.352034 1.51178 0.433506 1.65732 0.578556L4.9899 3.90399L8.32247 0.578556C8.39354 0.502456 8.47923 0.441419 8.57445 0.399085C8.66966 0.35675 8.77245 0.333987 8.87667 0.332152C8.9809 0.330317 9.08442 0.349448 9.18107 0.388404C9.27773 0.42736 9.36553 0.485343 9.43923 0.558894C9.51294 0.632445 9.57105 0.720056 9.61009 0.816502C9.64913 0.912948 9.6683 1.01625 9.66646 1.12025C9.66463 1.22425 9.64181 1.32682 9.59939 1.42183C9.55696 1.51684 9.49579 1.60235 9.41953 1.67326L6.08696 4.9987L9.41953 8.32413C9.49579 8.39504 9.55696 8.48055 9.59939 8.57556C9.64181 8.67058 9.66463 8.77314 9.66646 8.87714C9.6683 8.98114 9.64913 9.08445 9.61009 9.18089C9.57105 9.27734 9.51294 9.36495 9.43923 9.4385C9.36553 9.51205 9.27773 9.57003 9.18107 9.60899C9.08442 9.64795 8.9809 9.66708 8.87667 9.66524C8.77245 9.66341 8.66966 9.64064 8.57445 9.59831C8.47923 9.55598 8.39354 9.49494 8.32247 9.41884L4.9899 6.09341L1.65732 9.41884C1.51017 9.55566 1.31555 9.63014 1.11446 9.6266C0.913365 9.62306 0.721498 9.54177 0.579281 9.39986C0.437064 9.25795 0.3556 9.06649 0.352052 8.86583C0.348504 8.66516 0.423149 8.47096 0.560261 8.32413L3.89284 4.9987L0.560261 1.67326C0.4149 1.52803 0.333252 1.33117 0.333252 1.12591C0.333252 0.920651 0.4149 0.723786 0.560261 0.578556Z" fill="#000000"></path></svg>
               </div>
           </div>
           {show.emailSent ? <>
           <p className='Heading28B'>Contact Agent</p>

           <div class="form-group">
            <label className='text-left w-100 Heading16M mb_4' for="name">First Name*</label>
            <input value={emailDetails.firstName} onChange={(e)=>setEmailDetails({...emailDetails, firstName : e.target.value})} type="text" id="name" placeholder="Enter your first name" />
          </div>

          <div class="form-group">
            <label className='text-left w-100 Heading16M mb_4' for="name">Last Name*</label>
            <input value={emailDetails.lastName} onChange={(e)=>setEmailDetails({...emailDetails, lastName : e.target.value})} type="text" id="name" placeholder="Enter your last name" />
          </div>


          <div class="form-group">
            <label className='text-left w-100 Heading16M mb_4' for="phone">Phone*</label>
            <input value={emailDetails.phone} onChange={(e)=>setEmailDetails({...emailDetails, phone : e.target.value})} type="text" id="phone" placeholder="Enter your phone" />
          </div>

          <div class="form-group">
            <label className='text-left w-100 Heading16M mb_4' for="email">Email*</label>
            <input value={emailDetails.email} onChange={(e)=>setEmailDetails({...emailDetails, email : e.target.value})} type="text" id="email" placeholder="Enter your email" />
          </div>

          <div class="form-group">
            <label className='text-left w-100 Heading16M mb_4' for="message">Message*</label>
            <textarea value={emailDetails.message} type="message" onChange={(e)=>setEmailDetails({...emailDetails, message : e.target.value})} id="message" placeholder="Enter your message" />
          </div>

          <div className='w-100 mt_32'>
            <CustomButton 
              className={"w-100"}
              onClick={sendEmailFunc}
              btntext={"Contact agent"}
              disabled={emailDetails.firstName == "" || emailDetails.lastName == "" || emailDetails.phone == "" || emailDetails.email == "" || emailDetails.message == ""}
              icon = {show.emailLoader && <CircularProgress className='mr_8' style={{marginRight : '8px'}} color='inherit' size={"16px"} />}
            />
          </div>

          <div className='disclaimerText'>
            <div className='Heading10M'>
               By pressing Contact Agent, you agree that a real estate professional <br/>  may contact you about your inquiry by phone, text, and/or email.
            </div>
          </div>
          </> :
          
          <div>

            <img height={"200px"} width={"auto"} src="https://assets.materialup.com/uploads/378d2c84-810d-477a-802b-d495646b9c4e/preview.jpg" alt="" /> 
            <div className='Heading22B text-center'>
            Thank you! <br/> We'll connect with you shortly.
            </div>
          </div>
          
          }
          {console.log('show.emailSent ', show)}
           </div>
           <Toaster/>
         </div>
        </div>
      }
    </div>
  )
}


const Marker = ({ text, lat, lng, onMarkerClick, }) => {
  const markerStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -100%)', // Adjust as needed for marker alignment
    left: `${lat}%`, // Use percentage values based on map's latitude
    top: `${lng}%`, // Use percentage values based on map's longitude
    cursor: 'pointer',
  };

  const triangleStyle = {
      textAlign: 'center',
      transform: 'rotate(180deg)',
      marginTop: '-2px'
  };

  return (
    <div style={markerStyle} onClick={onMarkerClick}>
      <div className="marker-text text-center Heading14M d-flex">
        <span>$ </span> {text}
      </div>
      <div style={triangleStyle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          viewBox="0 0 12 12"
        >
          <path d="M6 0L12 12H0z" fill="#A3000B" />
        </svg>
      </div>
    </div>
  );
};

function GoogleMap({data, onMarkerClick, setState, state}){
  const defaultProps = {
    center: {
      lat: data[0]?.latitude,
      lng: data[0]?.longitude
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

  function handleBoundsChange(passedData) {
      const { bounds } = passedData;

      if (!bounds || state.filterApplied) {
        return;
      }
  
      const { ne, nw, se, sw } = bounds;
  
      if (!ne || !nw || !se || !sw) {
        return;
      }
  
      const visibleMarkers = state.data.filter((item) => {
        if (!item.latitude || !item.longitude) {
          return false; // Exclude items without lat/lng from visibleMarkers
        }
  
        return (
          item.latitude >= se.lat &&
          item.latitude <= nw.lat &&
          item.longitude >= nw.lng &&
          item.longitude <= se.lng
        );
      });
  
      setState({ ...state, filteredData: visibleMarkers });
  }

  return (
    <div className='h-100 w-100 borderRadius-4 overflow-hidden'>
      <GoogleMapReact
        bootstrapURLKeys = {{ key: "AIzaSyBIUUEUoLYKBnVKGvVjLchBzdMR-CUa5A4" }}
        defaultCenter    = {defaultProps.center}
        defaultZoom      = {defaultProps.zoom}
        onChange={handleBoundsChange}
      >
        {state.filteredData.map((item, index) => 
        <Marker
            lat           = {item?.latitude}
            lng           = {item?.longitude}
            index         = {index}
            onMarkerClick = {()=>onMarkerClick(index)}
            text          = {formatNumberWithK(parseInt(item.listprice))}
        />
        )}
      </GoogleMapReact>
    </div>
  );
}

