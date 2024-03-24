import React from 'react'
import EmptyImage from '../../icons/empty.png';
import { useFormik } from 'formik';
import CustomSlider from '../CustomSlider';
import '../Widget/global.css'
import '../Widget/Widget.css'

export default function HomePage() {

  const campaign_goals = [
    {
      title: "Awareness (engagement)",
      value: "awareness",
    },
    {
      title: "Consideration (Signups)",
      value: "consideration",
    },
    {
      title: "Installs / Downloads",
      value: "install",
    },
    {
      title: "Conversion (Purchases)",
      value: "conversion",
    }
  ]

  const platforms = [
    {
      title: "TikTok",
      value: "tiktok",
    },
    {
      title: "Instagram",
      value: "instagram",
    },
    {
      title: "Youtube",
      value: "youtube",
    },
    {
      title: "Lemon8",
      value: "lemon8",
    }
  ]

  const audience = [
    {
      title: "US",
      value: "us",
    },
    {
      title: "Global",
      value: "global",
    },
  ]

  const niche = [
   {
    title: 'Travel',
    value: 'travel'
   },
   {
    title: 'Fashion',
    value: 'fashion'
   },
   {
    title: 'Beauty',
    value: 'beauty'
   },
   {
    title: 'Sports',
    value: 'sports'
   },
   {
    title: 'Entertainment',
    value: 'entertainment'
   },
   {
    title: 'Mobile Apps',
    value: 'mobileApps'
   },
  ]

  const initialValues = {
    campaignGoal: '',
    niche       : '',
    platform    : '',
    views       : [100000,5000000],
    engagement: [218750,412500],
    placement: [],
    creatorSize: [81250000,250000000],
    audience   : '',
    targetStart: '',
  }

  const viewMarks = [
    {
      value: 100000,
      label: '100,000',
    },
    {
      value: 2575000,
      label: '2,575,000',
    },
    {
      value: 5050000,
      label: '5,050,000',
    },
    {
      value: 7525000,
      label: '7,525,000',
    },
    {
      value: 10000000,
      label: '10,000,000',
    },
  ];

  const engagementMarks = [
    {
      value: 25000,
      label: '25,000',
    },
    {
      value: 218750,
      label: '218,750',
    },
    {
      value: 412500,
      label: '412,500',
    },
    {
      value: 606250,
      label: '606,250',
    },
    {
      value: 800000,
      label: '800,000',
    },
  ];

  const creatorMarks = [
    {
      value: 25000000,
      label: '25,000,000',
    },
    {
      value: 81250000,
      label: '81,250,000',
    },
    {
      value: 137500000,
      label: '137,500,000',
    },
    {
      value: 193750000,
      label: '193,750,000',
    },
    {
      value: 250000000,
      label: '250,000,000',
    },
  ];

  const formik = useFormik({
    initialValues : {...initialValues}
  })

  const handlePlacementChangeFuncu = (value) => {
    const updatedPlacement = formik.values.placement.includes(value)
      ? formik.values.placement.filter(item => item !== value)
      : [...formik.values.placement, value];
  
    formik.setValues({ ...formik.values, placement: updatedPlacement });
  };

  const handleRangeChangeFunc = (value, keyName) => {
    formik.setValues({...formik.values, [keyName] : value})
  }
  

  return (
    <div id="HomePage">
      <div className='leftSection'>
        <h3 className='Heading20M text-center'>
          How much to start campaign
        </h3>
        <section className='singleSection'>
          <h3 className='Heading20M'>Campaign Goal</h3>
          <div className='d-flex mt_16 gap-16'>
            {campaign_goals.map((goal)=>
              <div className='singleCard middle cp position-relative' onClick={()=>formik.setValues({...formik.values, campaignGoal: goal.value})}>
                 <img src={EmptyImage} alt="" height={"72px"} width={"72px"}/>
                 <h5 className='mt_4 Heading13M'>{goal.title}</h5>
                 <div className={`circle middle ${formik.values.campaignGoal == goal.value && 'selected' && 'selected'}`}>
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.5L4 6L8 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                 </div>
              </div>
            )}
          </div>
        </section>

        {console.log('hello ', formik.values)}

        <section className='singleSection d-flex'>
          <div className='w-50'>
            <h3 className='Heading20M'>Niche</h3>
            <div className='mt_16'>
            <div class="form-group">
              <select onChange={formik.handleChange} name="niche" class="form-select form-select-md mb-3" aria-label=".form-select-md example">
                <option value={""} disabled selected>Select any category</option>
                {niche.map((niche, idx)=><option key={idx} value={niche.value}>{niche.title}</option>)}
              </select>
            </div>
            </div>
          </div>
          <div className='middle w-50'>
            <img src={EmptyImage} height={180} width={180} />
          </div>
        </section>

        <section className='singleSection'>
          <h3 className='Heading20M'>Campaign Scale</h3>
          <section>
              <h5 className='Heading14R mt_16 pl_8'>1. How many views</h5>
              <p className='text-right w-100 Caption12R mb_8'>{formik.values.views[0]?.toLocaleString()} - {formik.values.views[1]?.toLocaleString()}</p>
                <CustomSlider 
                  value    = {formik.values.views}
                  marks    = {viewMarks}
                  callback = {handleRangeChangeFunc}
                  keyName  = "views"
                  max      = {10000000}
                  min      = {100000}
                />
          </section>

          <sections>
              <h5 className='Heading14R mt_24 pl_8'>2. How much engagement</h5>
              <p className='text-right w-100 Caption12R mb_8'>{formik.values.engagement[0]?.toLocaleString()} - {formik.values.engagement[1]?.toLocaleString()}</p>
              <CustomSlider 
                  value    = {formik.values.engagement}
                  marks    = {engagementMarks}
                  callback = {handleRangeChangeFunc}
                  keyName  = "engagement"
                  max      = {800000}
                  min      = {25000}
                />
          </sections>
        </section>

        <section className='singleSection'>
          <h3 className='Heading20M'>Platform</h3>
          <p className='Caption12R mt_4' style={{color: '#9b9b9b'}}>You can choose several options</p>
          <div className='d-flex mt_16 gap-16'>
            {platforms.map((platform, idx)=>
              <div className='singleCard middle cp position-relative' key={idx}  onClick={()=>formik.setValues({...formik.values, platform: platform.value})}>
                 <img src={EmptyImage} alt="" height={"72px"} width={"72px"}/>
                 <h5 className='mt_4 Heading13M'>{platform.title}</h5>
                 <div className={`circle middle ${formik.values.platform == platform.value && 'selected'}`}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.5L4 6L8 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                 </div>
              </div>
            )}
          </div>
        </section>

        <section className='singleSection'>
          <h3 className='Heading20M'>Placements (number of media counts)</h3>
          <div className='mt_16'>
              <div className='d-flex'>
                <input type='checkbox' onChange={()=>handlePlacementChangeFuncu('videos')} value={"videos"} />
                <span className={`ml_8 ${formik.values.placement.includes('videos') ? 'Heading15M' : 'Heading15R'}`} style={{color: formik.values.placement.includes('videos') ? 'black' : '#8b8c96'}}>E.g number of videos</span>
              </div>
              <div className='d-flex mt_4'>
                <input type='checkbox' onChange={()=>handlePlacementChangeFuncu('pictures')} value={"pictures"} />
                <span className={`ml_8 ${formik.values.placement.includes('pictures') ? 'Heading15M' : 'Heading15R'}`} style={{color: formik.values.placement.includes('pictures') ? 'black' : '#8b8c96'}}>E.g number of pictures</span>
              </div>
          </div>
        </section>
        
        <section className='singleSection'>
            <h3 className='Heading20M'>Creator Size</h3>
              <p className='text-right w-100 Caption12R mb_8'>{formik.values.creatorSize[0].toLocaleString()} - {formik.values.creatorSize[1].toLocaleString()}</p>
                <CustomSlider
                  value    = {formik.values.creatorSize}
                  marks    = {creatorMarks}
                  callback = {handleRangeChangeFunc}
                  keyName  = "creatorSize"
                  max      = {250000000}
                  min      = {25000000}
                />
        </section>

        <section className='singleSection'>
          <h3 className='Heading20M'>Audience</h3>
          <div className='d-flex mt_16 gap-16'>
            {audience.map((audience)=>
              <div className='singleCard middle cp position-relative' onClick={()=>formik.setValues({...formik.values, audience: audience.value})} >
                 <img src={EmptyImage} alt="" height={"72px"} width={"72px"}/>
                 <h5 className='mt_4 Heading13M'>{audience.title}</h5>
                 <div className={`circle middle ${formik.values.audience == audience.value && 'selected'}`}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.5L4 6L8 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                 </div>
              </div>
            )}
          </div>
        </section>

        <section className='singleSection'>
          <h3 className='Heading20M'>Target Start Date</h3>
          <div className='d-flex mt_16 gap-16'>
              <div className='singleCard middle cp position-relative' onClick={()=>formik.setValues({...formik.values, targetStart: "immidiately"})}>
                 <img src={EmptyImage} alt="" height={"72px"} width={"72px"}/>
                 <h5 className='mt_8 Heading13M'>Immediately</h5>
                 <div className={`circle middle ${formik.values.targetStart == "immidiately" && 'selected'}`}>
                 <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 3.5L4 6L8 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                 </div>
              </div>
              <div className='singleCard middle cp position-relative' onClick={()=>formik.setValues({...formik.values, targetStart: "1-3"})}>
                 <h1 className='Heading36M mb_16 mt_12'>1-3</h1>
                 <h5 className='mt_8 Heading13M'>{'Months'}</h5>
                 <div className={`circle middle ${formik.values.targetStart == "1-3" && 'selected'}`}>
                 <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.5L4 6L8 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                 </div>
                

              </div>
              <div className='singleCard middle cp position-relative' onClick={()=>formik.setValues({...formik.values, targetStart: "3+"})}>
                 <h1 className='Heading36M mb_16 mt_12'>3+</h1>
                 <h5 className='mt_8 Heading13M'>Months</h5>
                 <div className={`circle middle ${formik.values.targetStart == "3+" && 'selected'}`}>
                 <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 3.5L4 6L8 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                 </div>
              </div>
          </div>
        </section>

      </div>
      <div className='rightSection'>
          <div className='singleSection'>
            <h3 className='Heading20M'>Approximate Calculation</h3>
            <div>
              <h3 className='Heading26M mt_32'>600.346</h3>
              <p className='Body14R' style={{color: '#9B9B9B'}}>
                Est. Audience Size
              </p>
              <h3 className='Heading26M mt_24'>$324</h3>
              <p className='Body14R' style={{color: '#9B9B9B'}}>
                Est. Cost
              </p>
              <h3 className='Heading26M mt_24'>$648 - 2.00x</h3>
              <p className='Body14R' style={{color: '#9B9B9B'}}>
                Est. IMV and ROI
              </p>
              <p className="Heading15M mt_24">
                Creators
              </p>
              {[1,2,3].map((creator, idx)=><div key={idx} className='singleCreator mt_8 d-flex space-between'>
                <div className='d-flex'>
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21.5659" cy="22" r="21.5659" fill="#D9D9D9"/>
                  </svg>
                  <div className='ml_8' style={{color: '#9B9B9B'}}>
                    <p className='Body14M'>Name Surname</p>
                    <p className='Body14R'>Followers: 1.2m</p>
                    <p className='Body14R'>USA, Florida</p>
                  </div>
                </div>
                <div>
                  <input type='checkbox'  value={"pictures"} />
                </div>
              </div>)}
            </div>
         </div>
          </div>
         
    </div>
  )
}
