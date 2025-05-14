import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MyBooking from './MyBooking';
import UserParkingMapPage from '../map/UserParkingMapPage';
import ParkingFullInfo from './ParkingFullInfo';
import Booking from './booking/Booking';
import BookingConfirmation from './booking/BookingConfirmation';
import Subscription from './booking/Subscription';
import PayPage from '../PayPage';
import SubscriptionConfirmation from './booking/SubscriptionConfirmation';
import ClientProfile from './ClientProfile';
import ChatPage from '../ChatPage';

const ClientPath = () => {
  return (
    <Routes>
        {/* <Route path="/" element={<></> } /> */}
        <Route path='/' element={<UserParkingMapPage/>}/>
        <Route path="/myBookings" element={<MyBooking/> } />
        <Route path="/profile" element={<ClientProfile/>} />
        <Route path="/chats" element={<></>} />
        <Route path="/parking/:id" element={<ParkingFullInfo/>} />
        <Route path="/parking/:id/booking/" element={<Booking />} />
        <Route path="/parking/:id/booking/confirmation/:spaceId/:startDate/:endDate" element={<BookingConfirmation />} />
        <Route path="/parking/:id/booking/subscription/:spaceId/:startDate/:endDate" element={<Subscription />} />
        <Route path="/parking/:id/booking/subscription/pay/:subscriptionParams" element={<PayPage />} />
        <Route path="/parking/:id/booking/subscription/confirmation/:subscriptionParams" element={<SubscriptionConfirmation />} />
        <Route path="*" element={<p>Cтраница не найдена</p>} />
    </Routes>
  );
};

export default ClientPath;