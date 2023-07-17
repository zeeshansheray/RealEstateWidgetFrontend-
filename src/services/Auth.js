import axios from 'axios'
import { Handlers } from '../utils'
import MainService from './Main'
import env from '../config'
const service  = '/v1/auth'

const Login          = async({payload}) => await axios.post(env.API_URL+service + '/login', payload)
const Signup         = async({payload}) => await axios.post(env.API_URL+service + '/signup', payload)
const SendEmail      = async({payload}) => await axios.post(env.API_URL+service + '/sendEmail', payload)
const ChangePassword = async({payload}) => await axios.post(env.API_URL+service + '/changePassword', payload)
const Update         = async({payload}) => await axios.put(env.API_URL+service + '/update', payload, {headers: await MainService.getTokenHeader()})



const AuthService = {
    Login         : Handlers.Services(Login),
    Signup        : Handlers.Services(Signup),
    SendEmail     : Handlers.Services(SendEmail),
    ChangePassword: Handlers.Services(ChangePassword),
    Update: Handlers.Services(Update),
}

export default AuthService
