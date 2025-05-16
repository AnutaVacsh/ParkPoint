import '../src/css/baseStyle.css';
import '../src/css/fonts.css';

import React, { useState } from 'react';
import { Routes, Route} from 'react-router-dom';

import HeaderGuest from './components/HeaderGuest';
import Home from './components/Home';
import Register from './components/register/Register';
import Login from './components/register/Login';
import Parking from './components/Parking';
import { HeaderContext } from './contexts/HeaderContext';
import HeaderClient from './components/HeaderClient';
import ClientPath from './components/Client/ClientPath';
import { UserContext } from './contexts/UserContext';
import HeaderStates from './dto/enam/headerState';
import ChooseRolePage from './components/register/ChooseRolePage';
import UserStates from './dto/enam/userState';
import { OwnerRegisterProvider } from './contexts/OwnerRegisterContext';
import OwnerRegisterStep1 from './components/register/OwnerRegisterStep1';
import OwnerRegisterStep2 from './components/register/OwnerRegisterStep2';
import HeaderOwner from './components/HeaderOwner';
import OwnerPath from './components/owner/OwnerPath';
import AdminPath from './components/ap/AdminPath';
import UserDashboard from './components/UserDashboard';
import CreateComplaint from './components/CreateComplaint';
import PayPage from './components/PayPage';
import ChatPage from './components/ChatPage';

const App = () => {
  const [headerState, setheaderState] = useState(localStorage.getItem("role") || HeaderStates.GUEST); //guest, client, none
  console.log(headerState)

  const [user, setUser] = useState(localStorage.getItem("role") || UserStates.GUEST); //guest, client, owner, admin
  console.log(user)

  return (
    <UserContext.Provider value={{user, setUser}}>
      <HeaderContext.Provider value={{headerState, setheaderState}}>
        <OwnerRegisterProvider>

          {headerState === HeaderStates.GUEST && (<HeaderGuest />)}
          {headerState === HeaderStates.CLIENT && (<HeaderClient />)}
          {headerState === HeaderStates.OWNER && (<HeaderOwner />)}

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/parking' element={<></>} />
            <Route path='/owners' element={<></>} />
            <Route path='/contacts' element={<></>} />
            <Route path='/chooseRolePage' element={<ChooseRolePage />} />
            <Route path='/register/client' element={<Register />} />
            <Route path='/register/owner' element={<OwnerRegisterStep1 />} />
            <Route path='/register/ownerStep2' element={<OwnerRegisterStep2 />} />
            <Route path='/login' element={<Login />} />
            <Route path='/parking' element={<Parking />} />
            <Route path="/client" element={(user === UserStates.CLIENT && <ClientPath />) || (<p>СТРАНИЦА НЕДОСТУПНА</p>)} />
            <Route path="/client/*" element={(user === UserStates.CLIENT && <ClientPath />) || (<p>СТРАНИЦА НЕДОСТУПНА</p>)} />
            <Route path="/owner" element={(user === UserStates.OWNER && <OwnerPath />) || (<p>СТРАНИЦА НЕДОСТУПНА</p>)} />
            <Route path="/owner/*" element={(user === UserStates.OWNER && <OwnerPath />) || (<p>СТРАНИЦА НЕДОСТУПНА</p>)} />
            <Route path="/admin" element={<AdminPath />} />
            <Route path="/admin/*" element={<AdminPath />} />
            <Route path="/user/dashboard/:id" element={< UserDashboard/>} />
            <Route path="/create/complain/:userId/:bookingId" element={< CreateComplaint/>} />
            <Route path="/chat/:userId2" element={<ChatPage />} />
            <Route path="/pay" element={<PayPage />} />
            
          </Routes>

        </OwnerRegisterProvider> {/* <-- И закрываешь здесь */}
      </HeaderContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
