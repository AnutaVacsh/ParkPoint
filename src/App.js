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

const App = () => {
  const [headerState, setheaderState] = useState(HeaderStates.OWNER); //guest, client, none
  console.log(headerState)

  const [user, setUser] = useState(UserStates.OWNER); //guest, client, owner, admin
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
          </Routes>

        </OwnerRegisterProvider> {/* <-- И закрываешь здесь */}
      </HeaderContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
