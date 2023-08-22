import axios from 'axios'
import { Handlers, utils } from '../utils'
import MainService from './Main'
import env from '../config/config'

const GetData   = async ({query}) => await axios.get(env.API_URL+'/getData?'+utils.getQueryString(query), {headers: await MainService.getTokenHeader()})


const AuthService = {
    GetData         : Handlers.Services(GetData),
}
// dada
export default AuthService
