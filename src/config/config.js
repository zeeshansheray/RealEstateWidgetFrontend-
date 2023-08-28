import { Environment } from '../enums/enums'

const env = {
    GOOGLE_CLIENT_ID: '',
    IMAGE_BASE_URL  : '',
    AuthKey         : 'andrew4a923a7dcef14a7d&*Testing123#',
    // API_URL         : 'http://localhost:8080'
    API_URL         : 'https://embed.realestateintegrate.com/api'


}

if(process.env.REACT_APP_ENV === Environment.DEVELOPMENT){
    env.API_URL            = 'http://localhost:8080'
}

if(process.env.REACT_APP_ENV === Environment.PRODUCTION){
    env.API_URL            = 'https://embed.realestateintegrate.com/api'
}



export default env