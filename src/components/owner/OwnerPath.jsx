import React from 'react';
import { Route, Routes } from 'react-router-dom';

import UserParkingMapPage from '../map/UserParkingMapPage';
// import ClientProfile from './ClientProfile';
// import MyBooking from '../';
import ParkingFullInfo from '../Client/ParkingFullInfo';
import MyBookingOwner from './MyBookingOwner';

const OwnerPath = () => {
  return (
    <Routes>
        <Route path='/' element={<UserParkingMapPage/>}/>
        <Route path="/myBookings" element={<MyBookingOwner/> } />
        {/* <Route path="/profile" element={<ClientProfile/>} /> */}
        <Route path="/chats" element={<></>} />
        <Route path="/parking/:id" element={<ParkingFullInfo/>} />
        <Route path="*" element={<p>Cтраница не найдена</p>} />
    </Routes>
  );
};

export default OwnerPath;