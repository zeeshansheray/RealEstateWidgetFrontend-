import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/global.scss'

import LayoutContextProvider from './context/layout.context';
import { UserContextComponent } from './context/user.context';
import { withToaster } from './context/Toaster.context';

import CustomToasters from './components/CustomToasters';

import {
  BrowserRouter,
  Routes,
  Route,
  withRouter,
} from "react-router-dom";

import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import {UserAuthGuard } from './utils/RouteGuards';

import ForgotPassword from './pages/auth/forgotpassword';
import EmailVerify from './pages/auth/EmailVerify';
import { CartContextComponent } from './context/cart.context';

//Admin Works


function App(props) {
  return (
    <div className="App">
       <LayoutContextProvider>
          <UserContextComponent {...props}>
            <CartContextComponent {...props} >
              <BrowserRouter>
                  <CustomToasters/>
                  <Routes>
                    <Route exact path = "/" 
                      element   = {
                        <Login/>
                      } 
                    />
                  </Routes>
              </BrowserRouter>
            </CartContextComponent>
          </UserContextComponent>
        </LayoutContextProvider>
    </div>
  );
}
// 
export default withToaster(App);
