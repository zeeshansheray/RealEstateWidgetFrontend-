import axios from 'axios'
import { Handlers, utils } from '../utils'
import MainService from './Main'
import env from '../config'
const service  = '/v1/product'
const service2  = '/v1/order'

const AddProduct    = async({payload}) => await axios.post(env.API_URL+service, payload, {headers: await MainService.getTokenHeader()})
const GetProducts   = async ({query}) => await axios.get(env.API_URL+service+'?'+utils.getQueryString(query), {headers: await MainService.getTokenHeader()})
const UpdateProduct = async({payload}) => await axios.put(env.API_URL+service, payload, {headers: await MainService.getTokenHeader()})
const GetAll        = async () => await axios.get(env.API_URL+service+'/all')
const UploadImage   = async({payload}) => await axios.post(env.API_URL+service + '/upload/image', payload, {headers: await MainService.getTokenHeader()})


const Checkout = async({payload}) => await axios.post(env.API_URL+service2 + '/createcheckout', payload, {headers: await MainService.getTokenHeader()})
const GetAllOrders        = async () => await axios.get(env.API_URL+service2+'/all',{headers: await MainService.getTokenHeader()})

const merchantAnaltytics = async ({query}) => await axios.get(env.API_URL+service2+'/merchantAnaltytics'+'?'+utils.getQueryString(query),{headers: await MainService.getTokenHeader()})


    //AdminAnalytics

const adminAnaltytics        = async () => await axios.get(env.API_URL+service2+'/adminAnaltytics',{headers: await MainService.getTokenHeader()})


const ProductService = {
    AddProduct     : Handlers.Services(AddProduct),
    GetProducts    : Handlers.Services(GetProducts),
    UpdateProduct  : Handlers.Services(UpdateProduct),
    GetAll         : Handlers.Services(GetAll),
    UploadImage    : Handlers.Services(UploadImage),
    Checkout       : Handlers.Services(Checkout),
    GetAllOrders   : Handlers.Services(GetAllOrders),
    adminAnaltytics: Handlers.Services(adminAnaltytics),
    merchantAnaltytics: Handlers.Services(merchantAnaltytics),




}

export default ProductService
