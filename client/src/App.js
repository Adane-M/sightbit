import React, { useState, createContext } from 'react';
import './App.css';
// import IconButton from '@mui/material/IconButton';
import { BrowserRouter, Routes, Route ,useParams} from 'react-router-dom';
import Main from './componnents/improved/Main';
import Chat from './componnents/improved/Chat';
import SignIn from './componnents/TaskLoginProj/SignIn';
import Auth from './componnents/auth/Auth';
import Navbar from './componnents/navbar/Navbar';
export const AppContext = createContext(null)

function App() {
  const [accessToken, setAccessToken] = useState('')
  const params = useParams();
  const par =()=>{
    if(params !== '/login'){
      return <Navbar />
    }
  }
  return (
    <BrowserRouter>
      <AppContext.Provider value={{ accessToken, setAccessToken }}>
        {/* <div className="App-header"> */}
       {par}
       <Navbar />
        <Routes>
          <Route path='/login' element={<SignIn />} />
          <Route path='/' element={<Auth><Main /></Auth>} />
          <Route path='/:userId/:selectedUserId' element={<Auth><Chat /></Auth>} />
        </Routes>

        {/* </div> */}
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;