import * as localForage from 'localforage'
import ReactDOM from 'react-dom';
import CustomToasters from '../components/CustomToasters';
import { ColorSchemeCode } from '../enums/ColorScheme';
import ct from 'countries-and-timezones'
import {ColorScheme, CountryCode, Currencies} from '../enums';


const Logout = async() => {
        localForage.clear().then(res => window.location.assign('/'))
}


const getRandomNumber = (length = 8) => {
    return Math.floor(Math.pow(10, length-1) + Math.random()*Math.pow(10, length-1))
}

const getQueryString = (query) => {
    return Object.entries(query).map(entry => entry[0]+'='+entry[1]).join('&')
}

const compareJSON = (objA, objB) => {
    return JSON.stringify(objA) === JSON.stringify(objB)
}

const showToaster = ({position, title, message, severity, delay}) => {
    const notifications = [{title, message, severity, progress: 0}]
    ReactDOM.render(<CustomToasters position={position} notifications={notifications} delay = {delay}/>, document.getElementById('Toaster'))
}

const getAvatar = ({firstName, lastName, className, width, heigth, bgColor, id, tableName, customers}) => {
    let randomNum  = getRandomNumber(6) // used for avatar background color
    let colorCode  = `#${randomNum}`
    let invertCode = invertColor(bgColor || colorCode)

    if(id && tableName && customers && customers.length > 0)
    {
        customers.map((element, idx)=>{
            if(element.user._id === id && !element.user.avatar && element.user.randomAvatar)
            {
                randomNum = element.user.randomAvatar.randomNum
                colorCode = element.user.randomAvatar.colorCode
                invertCode = element.user.randomAvatar.invertCode
            }
            else if(element.user._id === id && !element.user.randomAvatar)
            {
                let randomAvatar = {
                    randomNum  : randomNum,
                    colorCode  : colorCode,
                    invertCode : invertCode
                }

                customers[idx].user.randomAvatar = randomAvatar
            }
        })

    }

    return (
        <div 
            className={className + ' borderRadius-40'} 
            style={{
                width           : width ||'40px',
                height          : heigth ||'40px',
                backgroundColor : bgColor || colorCode,
                display         : 'flex',
                flexDirection   : 'column',
                justifyContent  : 'center',
                alignItems      : 'center',
                color           : ColorSchemeCode.cffffff,
                fontSize        : '16px',
                textTransform   : 'uppercase'
            }}
        >
            {   
                firstName ?
                lastName ? firstName[0]+lastName[0] : firstName[0]+firstName[1] :
                'AV'
            }
        </div>
    )
}


const emptyJSON = (json) => {
    return JSON.stringify(json) === '{}'
}

const getDate = (dateInMS, withTime=false) => {
    if(!dateInMS) return
    const timeOptions = {hour: '2-digit', minute: '2-digit'}
    return new Date(dateInMS).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year:'numeric', ...(withTime && timeOptions)}).split('/').join('-')
}

const booleanHasAnyValue = (boolean) => {
    return typeof(boolean) === 'boolean'
}
const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const capitalizeAll = (string) => {
      const Arr = string.split(" ")
      let result = []
      Arr.map((value, index)=>(
          result.push(value.charAt(0).toUpperCase() + value.slice(1))
      ))
    return result.join(' ')
}


const getCurrency = ({location, currencyCode}) => {
    if(currencyCode) return Currencies.filter(currency => currency.code === currencyCode)[0]

    if(location){
        const currency = CountryCode.filter(country => country.code === location.countryCode)[0]
        if(currency)
        return { 
            code   : currency.currencyCode,
            symbol : currency.currencySymbol
        }
    }
}


const invertColor = (hex, bw) => {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);

    function padZero(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }

    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}


const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const summarisedLocation = (place) => {
    let location = {
        lat         : place.geometry.location.lat(),
        lng         : place.geometry.location.lng(),
        address     : place.formatted_address,
        country     : '',
        city        : '',
        countryCode : '',
        state       : '',
        offset   : place.utc_offset_minutes || ''
    }

    const addressTypes = {
        'administrative_area_level_1' : (address) => location.state = address.short_name,
        'locality'                    : (address) => location.city = address.long_name,
        'country'                     : (address) => {
                                            location.country     = address.long_name
                                            location.countryCode = address.short_name
                                        },
    }

    place.address_components.map(address => addressTypes[address.types[0]] && addressTypes[address.types[0]](address))
    
    if(!location.offset)
    location.offset = getLocationUTC(location) || ''

    return location
}


const getLocationUTC = (location) => {
    if(!location.countryCode) return
    const countryTimezone = ct.getCountry(location.countryCode)


    if(!location.country || !location.state) return
    const filteredTimezone = countryTimezone.timezones.filter(timezone => timezone === location.country+'/'+location.state) || []


    if(countryTimezone && !filteredTimezone.length && countryTimezone.timezones.length)
    return ct.getTimezone(ct.getCountry(location.countryCode).timezones[0]).offset

    return ct.getTimezone(filteredTimezone[0]).offset
}

const getTimezone = ({location, timezoneName}) => {
    const timezones = Object.values(ct.getAllTimezones())

    if(timezoneName) return timezones.filter(timezone => timezone.name === timezoneName)[0]

    if(location){
        const selectedTimezone = timezones.filter(timezone => {
            if(timezone.country === location.countryCode && timezone.utcOffset === location.offset) return true
            else if(timezone.country === location.countryCode) return true
            else return false
        })
        if(selectedTimezone && selectedTimezone.length) return selectedTimezone[0].name
    }
  
}



export {
    Logout,
    capitalizeAll,
    capitalize,
    getRandomNumber,
    getQueryString,
    compareJSON,
    emptyJSON,
    getDate,
    booleanHasAnyValue,
    showToaster,
    getAvatar,
    invertColor,
    hslToHex,
    summarisedLocation,
    getCurrency,
    getTimezone
}