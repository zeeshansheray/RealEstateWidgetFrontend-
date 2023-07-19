import React, {useEffect, useState} from 'react'
import AuthService from '../services/Auth';
import PngIcons from '../icons/png.icon';

export default function HomePage() {

  const [state, setState] = useState({
    loader: true,
    data  : []
  })

  const onLoad = async() => {
    setState({...state, loader : true})
    console.log('onload called')
    let query = {
      ref : 'des54556'
    }
    const {response,error} = await AuthService.GetData({query});
    if(response){
      setState({...state, data : response.data, loader : false})
    }
    console.log('fetched Data ', response)
  }

  useEffect(()=>{
    onLoad();
  },[])

  function calculateAreaInSqft(lengthInInches, widthInInches) {
    const inchesPerFoot = 12;
    const lengthInFeet = lengthInInches / inchesPerFoot;
    const widthInFeet = widthInInches / inchesPerFoot;
    const areaInSqft = lengthInFeet * widthInFeet;
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
      <div class="container">
        {state.loader ? <img className='absoluteMiddle' src={PngIcons.loader} width="50px" height={"auto"} alt="" />  : 
        state?.data.map((data)=>
        <div class="box">
          <div class="top">
            <img src={data.media[0].MediaURL} alt="" height={"165px"} width="100%" />
            <p className='price Heading16B'>$ {parseInt(data?.listprice)?.toLocaleString()}</p>
          </div>
          <div class="bottom">
            <h3 className='Heading16M'>{data.unparsedaddress}</h3>
            <h3 className='Caption14M mt_2 color-info60'>{data.city}</h3>
            <div class="advants mt_16">
              <p className='Heading13M color-Heading'>
                  {data?.bedroomstotal || 0} Beds, {data?.bathroomstotalinteger || 0} Baths, {parseInput(data.lotsizedimensions)} Sqft
              </p>
            </div>
          </div>
        </div>)}
    </div>
    </div>
  )
}
