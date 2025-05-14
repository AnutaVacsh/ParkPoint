import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AdminDashboard from './AdminDashboard';
import APParkingSpaces from './APParkingSpaces';
import APParkingZones from './APParkingZones';
import APUsers from './APUsers';
import APComplaints from './APComplaints';
import AddParkingZonePage from './AddParkingZonePage';

const AdminPath = () => {
  return (
    <Routes>
        <Route path='/' element={<AdminDashboard/>}/>
        <Route path="/parking-spaces" element={<APParkingSpaces />} />
        <Route path="/complaints" element={<APComplaints />} />
        <Route path="/parking-zones" element={<APParkingZones/>} />
        <Route path="/users" element={<APUsers />} />
        <Route path="/add-parking-zone" element={<AddParkingZonePage />} />
        
        <Route path="*" element={<p>Cтраница не найдена</p>} />
    </Routes>
  );
};

export default AdminPath;