import { Environment } from '../enums/enums'

const env = {
    API_URL : 'http://localhost:8080/api',
    GOOGLE_CLIENT_ID : '',
    IMAGE_BASE_URL : ''
}

if(process.env.REACT_APP_ENV === Environment.DEVELOPMENT){
    env.API_URL            = 'http://localhost:8080/api'
}

if(process.env.REACT_APP_ENV === Environment.PRODUCTION){
    env.API_URL            = 'https://myutopiah.com/api'
}



export default env