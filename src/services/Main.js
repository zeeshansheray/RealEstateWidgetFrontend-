import * as localForage from 'localforage'
import env from '../config/index';


const getTokenHeader = async () => {
    const user = await localForage.getItem('user');
    return { 'x-auth-token': 'Bearer ' + env.AuthKey, "Access-Control-Allow-Origin" : "http://localhost:3000" }
}

const MainService = {
    getTokenHeader
}

export default MainService