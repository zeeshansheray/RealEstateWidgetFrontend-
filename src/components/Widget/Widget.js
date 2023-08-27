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
      setShow({...show, contactModal : false, emailSent : true})
      setEmailDetails({firstName : '', lastName : '', email : '', phone : '', message : ''})
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error while sending email')
    }
    setShow({...show, emailLoader : false})
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
           {!show.emailSent ? <>
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
               By pressing Contact Agent, you agree that a real estate professional may contact <br/> you about your inquiry by phone, text, and/or email.
            </div>
          </div>
          </> :
          
          <div>
            <img src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20data-name%3D%22%E2%80%98%C3%AB%C3%AE%C3%A9_1%22%20viewBox%3D%220%200%205000%204000%22%3E%3Cpath%20fill%3D%22%23c8def4%22%20d%3D%22M2405.76%203104.72q-26.975%200-54-.794c-148.04-4.352-293.734-26.487-433.032-65.792-142.15-40.11-274.523-97.258-393.438-169.859a1235.217%201235.217%200%200%201-525.413-652.829c-52.56-152.567-78.516-319.4-73.085-469.766%203.093-85.63%2016.146-166.011%2038.797-238.91%2024.839-79.938%2061.383-151.244%20108.618-211.937%2043.595-56.017%2094.458-96.905%20151.18-121.53%2050.754-22.034%20107.803-31.706%20169.574-28.75%2053.568%202.566%20110.633%2014.196%20174.456%2035.554%2050.782%2016.995%20104.304%2039.54%20168.438%2070.95%20146.232%2071.62%20260.343%20111.58%20369.995%20129.57%20133.76%2021.943%20260.741%209.572%20388.2-37.821%20117.59-43.725%20224.35-118.444%20327.594-190.701%20127.364-89.138%20259.062-181.311%20413.088-217.115a523.12%20523.12%200%200%201%20219.068-4.241c68.851%2013.304%20135.248%2040.086%20197.346%2079.602%2060.213%2038.316%20114.18%2087.145%20160.402%20145.13a695.807%20695.807%200%200%201%20108.692%20192.728c54.109%20146.329%2073.122%20301.828%2056.513%20462.179-15.398%20148.655-60.792%20297.765-134.923%20443.192-140.6%20275.822-375.249%20516.336-643.778%20659.872-125.582%2067.127-263.46%20117.524-409.803%20149.792a1786.813%201786.813%200%200%201-384.488%2041.476ZM1373.45%201164.034c-50.784%200-97.827%209.263-140.098%2027.615-53.614%2023.276-101.848%2062.124-143.362%20115.467-45.75%2058.787-81.18%20127.957-105.302%20205.59-22.126%2071.207-34.88%20149.834-37.91%20233.696-5.343%20147.968%2020.23%20312.23%2072.009%20462.53a1215.215%201215.215%200%200%200%20516.925%20642.273c117.359%2071.65%20248.051%20128.067%20388.448%20167.68%20137.721%2038.86%20281.784%2060.746%20428.187%2065.05%20147.07%204.322%20292.95-9.21%20433.595-40.222%20144.558-31.874%20280.712-81.635%20404.682-147.9%20265.01-141.654%20496.6-379.05%20635.387-651.316%2073.008-143.224%20117.705-289.973%20132.848-436.17%2016.291-157.278-2.34-309.75-55.377-453.182a675.871%20675.871%200%200%200-105.574-187.197c-44.84-56.252-97.157-103.599-155.499-140.724-59.97-38.16-124.03-64.013-190.403-76.838a503.286%20503.286%200%200%200-210.745%204.085c-67.305%2015.645-136.28%2043.836-210.867%2086.182-66.87%2037.965-132.15%2083.653-195.282%20127.837-104.275%2072.98-212.101%20148.444-332.091%20193.061-130.805%2048.639-261.125%2061.335-398.41%2038.811-111.664-18.319-227.488-58.827-375.552-131.343-63.322-31.013-116.066-53.239-165.989-69.946-62.056-20.767-117.358-32.066-169.066-34.542q-10.374-.497-20.554-.497Z%22%2F%3E%3Cpath%20fill%3D%22%23c8def4%22%20d%3D%22M3654.146%20887.942c-187.493-227.881-514.828-324.312-770.08-163.324-240.228%20151.512-347.701%20448.19-564.843%20627.51-227.656%20188.002-478.274%20197.862-753.902%20164.31-237.584-28.92-507.988-24.375-601.87%20252.381-101.806%20300.11%2048.415%20653.29%20230.23%20884.648%20179.257%20228.101%20429.267%20380.882%20704.781%20440.709%20549.117%20119.24%201196.178-80.167%201587.406-503.826%20404.437-437.963%20577.008-1205.634%20168.278-1702.408Z%22%2F%3E%3Cpath%20fill%3D%22%23211f44%22%20d%3D%22m2448.233%201227.042-841.896%20723.301%2015.669%20327.27c0%2039.036%2047.09%20592.5%2091.88%20592.5L2500%202344.039l708.323%20472.07c44.79%200%20131.261-514.34%20131.261-553.377l52.356-313.155-842.649-722.534c-29.569-20.529-71.49-20.529-101.058%200Z%22%2F%3E%3Crect%20width%3D%221489.411%22%20height%3D%221514.687%22%20x%3D%221755.295%22%20y%3D%221486.086%22%20fill%3D%22%23fff%22%20rx%3D%2265.535%22%2F%3E%3Cpath%20fill%3D%22%23211f44%22%20d%3D%22m2194.816%201661.026%20137.248-8.692q5.94%200%2011.436%2011.438%200%2017.39-40.259%2017.384l-80.06%204.575-1.83.914q11.43%2074.575%2011.437%20283.186-2.294%2020.126-14.411%2020.129-12.126%200-13.953-18.3v-106.137q0-106.13-9.608-177.047-81.896%207.784-81.89%2018.299l-4.117%201.83q-14.186-4.117-14.182-14.64%200-25.154%20100.19-32.939Z%22%2F%3E%3Cpath%20fill%3D%22%23211f44%22%20d%3D%22M2323.822%201697.168q12.803%200%2012.81%2031.109l5.49%2078.688h1.83l22.874-8.693q38.429%200%2046.664%2078.688%203.195%2022.421%203.202%2065.879v37.056q0%2017.382-12.81%2017.385h-1.83q-12.35-1.834-12.35-13.267v-43.004q0-103.385-20.13-114.372h-2.746q-13.724%200-20.129%2042.089v25.62q0%2068.622-11.437%2068.622l-8.693.915q-12.813%200-12.81-37.971%201.373-40.252%205.491-65.878l-9.607-150.514q0-11.89%2014.181-12.352ZM2528.316%201773.11q20.127%200%2020.13%2016.013l-4.117%208.692-2.745%2083.72q0%2056.733%2022.874%2070.454l.915%206.862q-1.373%2013.264-12.352%2013.267h-2.745q-34.312-23.332-34.311-71.368h-3.203q-18.302%2051.242-44.376%2051.239-24.255-6.863-24.247-36.142%200-64.506%2051.696-128.554%2017.382-14.175%2032.481-14.182Zm-55.356%20124.437-1.83%2012.81v8.692h4.575q34.313-85.543%2034.313-104.307h-1.83q-26.54%2029.744-35.228%2082.805ZM2640.398%201795.528q38.878%203.206%2038.885%2037.971l.915%205.948-.915%2071.368q0%2012.351%2014.183%2033.396v.915q-3.667%2013.264-13.268%2013.268-28.37-11.902-28.364-50.324v-5.947l-1.372-.916%201.372-1.83v-.915l1.373-63.133q0-13.263-11.438-13.267h-5.49q-22.88%209.157-22.874%20100.19%200%2031.567-16.011%2031.566-12.353%200-12.81-15.554v-45.749q0-88.749%2015.555-88.752l4.574-1.373%209.607%201.373a46.245%2046.245%200%200%201%2026.077-8.235ZM2735.552%201707.69h2.745q5.94%200%2011.436%2010.065l-1.83%2031.109v17.385l1.83%2080.06%201.373%204.575h1.372q19.666-18.292%2034.312-64.506l10.065-3.202q12.802%201.833%2012.81%2011.437%200%2029.743-42.547%2080.06v3.202q56.27%2065.428%2074.113%2065.421h2.746l11.436-6.862h4.117q9.608%200%2014.183%2012.81%200%2014.636-32.482%2020.129-32.488%200-84.635-65.878h-4.118l1.373%2024.704v23.79q-2.744%2014.174-14.182%2014.182-12.813-2.745-12.81-14.182v-2.745l-1.83-52.611q-5.039%200-6.862-14.182l5.947-11.438-2.745-102.934v-20.13q0-40.252%2014.183-40.26ZM2297.287%202050.2q16.008%200%2021.96%2070.453%207.773%2032.49%2011.437%2032.482h2.745q11.428-28.823%2011.436-57.187l-2.745-31.566q5.029-12.352%2014.183-12.352%2016.92%200%2016.926%2059.93%2010.058%2062.223%2010.066%20115.745v21.502q0%2098.357-55.815%20132.672l-10.064%201.83q-26.077%200-48.493-48.494l-4.118-27.45v-1.371q0-30.195%2016.927-30.195l11.437%207.32-1.372%2028.822q0%2021.036%2021.502%2042.546h5.947q25.154%200%2037.057-96.072l.915-26.535q-.462-46.214-3.66-59.015-18.304%2016.018-28.822%2016.011-23.332%200-41.631-124.894l-1.373-.915q0-10.518%2015.555-13.267ZM2481.654%202014.974q33.851%200%2051.24%2050.323l1.83%209.607q0%2048.958-45.75%20100.19-18.302%2016.93-37.056%2016.927-27.45%200-38.887-31.567-4.117-14.635-4.117-25.619v-5.49q0-72.279%2052.61-109.797a44.43%2044.43%200%200%201%2020.13-4.574Zm-45.749%20118.946q0%2031.116%2016.013%2031.11%2033.388%200%2055.356-85.55v-8.693q-7.784-28.36-28.822-28.364-8.235%200-8.235%2011.436%200%207.786-18.299%2012.353-16.02%2026.998-16.013%2067.708ZM2577.724%202049.742l8.234-4.574q10.979%200%2016.012%2013.267a328.025%20328.025%200%200%200-7.32%2069.538q0%2017.841%2010.523%2038.886h2.744q13.264%200%2031.567-104.764%206.402-5.49%2012.352-5.49%2014.175%200%2014.183%2050.324%205.94%2055.36%2013.266%2055.355l6.862-2.745q13.265%205.04%2013.268%2014.183-8.235%2017.392-22.874%2017.384-16.47%200-31.567-32.939-18.304%2038.429-37.057%2038.429-27.91%200-38.886-58.1l-1.373-14.64v-4.576a236.589%20236.589%200%200%201%2010.066-69.538Z%22%2F%3E%3Cpath%20fill%3D%22%23262f5f%22%20d%3D%22m2517.255%202497.327%20406.24-399.703c106.688-104.972%20258.967-164.95%20418.792-164.95%2037.535%200%2067.962%2023.848%2067.962%2053.265v1068.33c0%2029.417-50.743%2074.086-88.277%2074.086h-230.83L2517.255%202563.7c-19.194-18.885-19.194-47.488%200-66.374Z%22%2F%3E%3Cpath%20fill%3D%22%23262f5f%22%20d%3D%22m2482.745%202496.598-406.24-399.704c-106.688-104.972-258.967-164.95-418.792-164.95-37.535%200-67.962%2023.848-67.962%2053.265v1074.738c0%2029.418%2043.564%2068.407%2081.099%2068.407l238.008-.73%20573.887-564.652c19.194-18.886%2019.194-47.489%200-66.374Z%22%2F%3E%3Cpath%20fill%3D%22%232c447d%22%20d%3D%22M3410.248%202835.607V3066c0%2034.436-36.313%2062.348-81.093%2062.348h-1658.31c-44.78%200-81.093-27.912-81.093-62.348v-230.394l859.716-526.487c13.99-8.562%2030.748-13.086%2047.67-13.545%2018.81-.513%2037.81%204.01%2053.395%2013.545Z%22%2F%3E%3Cpath%20fill%3D%22%23211f44%22%20d%3D%22m2660.998%202355.166%20749.25%20382.429-.002%2098.012-762.723-467.183%2013.475-13.258zM2339%202355.166l-749.249%20382.429.001%2098.012%20762.723-467.183-13.475-13.258z%22%2F%3E%3Cpath%20fill%3D%22%232c447d%22%20d%3D%22m2071.904%201080.208-175.715%20570.678-28.156%2091.441-80.272-67.735-209.807-177.008%20493.95-417.376z%22%2F%3E%3Cpath%20fill%3D%22%23262f5f%22%20d%3D%22m2071.896%201080.208-610.482%20352.584-277.689-92.027%20888.171-260.557z%22%2F%3E%3Cpath%20fill%3D%22%23211f44%22%20d%3D%22m2071.896%201080.208-493.934%20417.38-94.933%20189.807-21.615-254.603%20610.482-352.584z%22%2F%3E%3Cpath%20fill%3D%22%23749dd3%22%20d%3D%22M2256.357%203011.555a10%2010%200%200%201-2.856-.418%20839.488%20839.488%200%200%201-60.815-20.682%2010%2010%200%201%201%207.16-18.674%20819.422%20819.422%200%200%200%2059.36%2020.186%2010.002%2010.002%200%200%201-2.85%2019.588Zm-137.466-54.678a9.952%209.952%200%200%201-4.494-1.073%20859.9%20859.9%200%200%201-56.215-31.045%2010%2010%200%201%201%2010.318-17.133%20840.032%20840.032%200%200%200%2054.901%2030.32%2010.001%2010.001%200%200%201-4.51%2018.931Zm-125.764-77.901a9.952%209.952%200%200%201-5.982-1.994%20852.549%20852.549%200%200%201-49.941-40.379%209.95%209.95%200%200%201-3.233-5.59%20295.178%20295.178%200%200%201-28.608%208.468%2010%2010%200%201%201-4.707-19.437%20267.583%20267.583%200%200%200%2057.358-20.939%2010%2010%200%201%201%208.998%2017.862q-6.993%203.523-14.242%206.67a833.31%20833.31%200%200%200%2046.354%2037.33%2010%2010%200%200%201-5.997%2018.009Zm-174.103-31.32c-.16%200-.32-.004-.481-.01a365.258%20365.258%200%200%201-64.55-9.051%2010%2010%200%200%201%204.495-19.489%20345.153%20345.153%200%200%200%2061.003%208.561%2010%2010%200%200%201-.467%2019.99Zm-142.793-36.022a9.962%209.962%200%200%201-4.08-.875%20561.146%20561.146%200%200%201-57.292-29.86%2010%2010%200%201%201%2010.223-17.189%20541.116%20541.116%200%200%200%2055.239%2028.793%2010.002%2010.002%200%200%201-4.09%2019.13Zm206.763-31.41a9.973%209.973%200%200%201-7.371-3.239%20418.992%20418.992%200%200%201-40.162-51.097%2010%2010%200%201%201%2016.656-11.07%20399.023%20399.023%200%200%200%2038.243%2048.646%2010%2010%200%200%201-7.366%2016.76Zm147.029-12.465a10%2010%200%200%201-7.347-16.782%20199.938%20199.938%200%200%200%2017.212-21.428%20174.814%20174.814%200%200%200%2016.007-28.476%2010%2010%200%200%201%2018.264%208.149%20194.893%20194.893%200%200%201-17.846%2031.739%20220.245%20220.245%200%200%201-18.938%2023.579%209.976%209.976%200%200%201-7.352%203.219Zm-479.77-33.367a9.96%209.96%200%200%201-6.166-2.133%20702.601%20702.601%200%200%201-48.754-42.043%2010%2010%200%201%201%2013.741-14.531%20682.404%20682.404%200%200%200%2047.36%2040.84%2010%2010%200%200%201-6.18%2017.867Zm256.444-79.819a10.005%2010.005%200%200%201-9.553-7.057c-6.021-19.538-9.075-38.58-9.074-56.596%200-3.192.097-6.399.287-9.534a10%2010%200%201%201%2019.963%201.213c-.166%202.733-.25%205.533-.25%208.32%200%2016.018%202.754%2033.079%208.187%2050.706a10.008%2010.008%200%200%201-9.56%2012.948Zm275.563-21.66a10%2010%200%200%201-10-9.96%20174.661%20174.661%200%200%200-10.157-58.889%2010%2010%200%200%201%2018.807-6.802%20194.616%20194.616%200%200%201%2011.35%2065.61%2010%2010%200%200%201-9.96%2010.04Zm-637.912-1.67a9.979%209.979%200%200%201-7.695-3.607%20730.446%20730.446%200%200%201-38.905-51.252%2010%2010%200%200%201%2016.449-11.377%20710.745%20710.745%200%200%200%2037.835%2049.844%2010%2010%200%200%201-7.684%2016.392Zm385.147-116.246a10%2010%200%200%201-7.414-16.707c14.785-16.353%2034.493-29.055%2056.992-36.732a10%2010%200%201%201%206.46%2018.927c-19.293%206.584-36.104%2017.38-48.617%2031.22a9.976%209.976%200%200%201-7.42%203.292Zm-467.464-6.584a9.999%209.999%200%200%201-8.844-5.318%20726.367%20726.367%200%200%201-27.586-58.139%2010%2010%200%200%201%2018.434-7.76%20705.86%20705.86%200%200%200%2026.823%2056.531%2010.004%2010.004%200%200%201-8.827%2014.686Zm661.113-5.84a9.956%209.956%200%200%201-6.081-2.07%20134.633%20134.633%200%200%200-53.357-24.186%2010%2010%200%201%201%204.22-19.548c22.756%204.912%2043.957%2014.55%2061.314%2027.87a10%2010%200%200%201-6.096%2017.933ZM1306.75%202371.28a10.005%2010.005%200%200%201-9.614-7.265%20692.576%20692.576%200%200%201-14.73-62.68%2010%2010%200%200%201%2019.664-3.658%20672.466%20672.466%200%200%200%2014.302%2060.863%2010.008%2010.008%200%200%201-9.622%2012.74Zm-24.71-145.746a10%2010%200%200%201-9.973-9.418%20703.329%20703.329%200%200%201-.792-64.37%2010%2010%200%200%201%2019.989.666%20683.25%20683.25%200%200%200%20.769%2062.54%2010%2010%200%200%201-9.4%2010.566c-.199.01-.396.016-.592.016Zm7.108-147.68a10.006%2010.006%200%200%201-9.896-11.52%20731.736%20731.736%200%200%201%2012.581-63.103%2010%2010%200%201%201%2019.422%204.772%20711.726%20711.726%200%200%200-12.235%2061.37%2010.002%2010.002%200%200%201-9.872%208.481Zm37.373-143.058a10.007%2010.007%200%200%201-9.362-13.513%20724.15%20724.15%200%200%201%2025.251-59.193%2010%2010%200%200%201%2018.027%208.663%20703.912%20703.912%200%200%200-24.55%2057.55%2010.005%2010.005%200%200%201-9.366%206.493Zm66.081-132.258a10.002%2010.002%200%200%201-8.411-15.395%20687.77%20687.77%200%200%201%2037.236-52.54%2010%2010%200%201%201%2015.753%2012.321%20667.886%20667.886%200%200%200-36.148%2051.007%209.994%209.994%200%200%201-8.43%204.607Z%22%2F%3E%3Cpath%20fill%3D%22%23262f5f%22%20d%3D%22M3284.106%201446.142a10%2010%200%200%201-7.072-17.072l65.531-65.53a10%2010%200%200%201%2014.143%2014.142l-65.531%2065.53a9.973%209.973%200%200%201-7.072%202.93Z%22%2F%3E%3Cpath%20fill%3D%22%23262f5f%22%20d%3D%22M3284.106%201448.642a12.5%2012.5%200%200%201-8.84-21.34l65.532-65.53a12.5%2012.5%200%200%201%2017.678%2017.678l-65.532%2065.53a12.42%2012.42%200%200%201-8.838%203.662Zm65.532-85.527a7.485%207.485%200%200%200-5.306%202.193l-65.53%2065.53a7.5%207.5%200%200%200%2010.607%2010.607l65.531-65.53a7.496%207.496%200%200%200-5.302-12.8ZM3424.232%201539.92a10.076%2010.076%200%200%201-1.498-.112l-109.058-16.383a10%2010%200%200%201%202.97-19.778l109.06%2016.382a10%2010%200%200%201-1.474%2019.89Z%22%2F%3E%3Cpath%20fill%3D%22%23262f5f%22%20d%3D%22M3424.232%201542.42a12.578%2012.578%200%200%201-1.869-.14l-109.058-16.383a12.5%2012.5%200%201%201%203.713-24.723l109.058%2016.383a12.5%2012.5%200%200%201-1.844%2024.863Zm-109.074-36.385a7.5%207.5%200%200%200-1.111%2014.918l109.058%2016.382a7.49%207.49%200%200%200%208.53-6.302%207.509%207.509%200%200%200-6.301-8.531l-109.059-16.383a7.543%207.543%200%200%200-1.117-.084ZM3206.698%201415.087a10.001%2010.001%200%200%201-9.876-8.516l-16.383-109.058a10%2010%200%201%201%2019.778-2.971L3216.6%201403.6a10.008%2010.008%200%200%201-9.902%2011.487Z%22%2F%3E%3Cpath%20fill%3D%22%23262f5f%22%20d%3D%22M3206.698%201417.587a12.571%2012.571%200%200%201-12.348-10.645l-16.383-109.058a12.5%2012.5%200%200%201%2024.723-3.713l16.382%20109.057a12.5%2012.5%200%200%201-10.505%2014.219%2012.613%2012.613%200%200%201-1.869.14Zm-16.356-129.061a7.56%207.56%200%200%200-1.127.084%207.499%207.499%200%200%200-6.303%208.531l16.383%20109.058a7.489%207.489%200%200%200%208.53%206.303%207.499%207.499%200%200%200%206.302-8.53l-16.383-109.058a7.508%207.508%200%200%200-7.402-6.388Z%22%2F%3E%3C%2Fsvg%3E" />
            <div className='Heading22B text-center' style={{marginTop : '-40px'}}>
            Thank you! <br/> We'll connect with you shortly.
            </div>
          </div>
          
          }
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

