import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/global.scss'

import LayoutContextProvider from './context/layout.context';
import { UserContextComponent } from './context/user.context';
import { withToaster } from './context/Toaster.context';

import CustomToasters from './components/CustomToasters';
import HomePage from './pages/HomePage';

import {
  BrowserRouter,
  Routes,
  Route,
  withRouter,
} from "react-router-dom";


//Admin Works


function App(props) {
  return (
    <div className="App">
       <LayoutContextProvider>
          <UserContextComponent {...props}>
              <BrowserRouter>
                  <CustomToasters/>
                  <Routes>
                    <Route exact path = "/" 
                      element   = {
                        <HomePage/>
                      } 
                    />
                  </Routes>
              </BrowserRouter>
          </UserContextComponent>
        </LayoutContextProvider>
    </div>
  );
}
// 
export default withToaster(App);
