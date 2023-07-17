import * as localForage from 'localforage'


const getTokenHeader = async () => {
    const user = await localForage.getItem('user');
    return { 'x-auth-token': 'Bearer ' + user.token, "Access-Control-Allow-Origin" : "http://localhost:3000" }
}

const MainService = {
    getTokenHeader
}

export default MainService