import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MyBooking from './MyBooking';

const ClientPath = () => {
  return (
    <Routes>
        <Route path="/" element={<></> } />
        <Route path="/myBookings" element={<MyBooking/> } />
        <Route path="/profile" element={<></>} />
        <Route path="/chats" element={<></>} />
        <Route path="*" element={<p>Cтраница не найдена</p>} />
    </Routes>
  );
};

export default ClientPath;