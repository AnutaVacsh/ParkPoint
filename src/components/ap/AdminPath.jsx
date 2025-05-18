import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import AdminDashboard from './AdminDashboard';
import APParkingSpaces from './APParkingSpaces';
import APParkingZones from './APParkingZones';
import APUsers from './APUsers';
import APComplaints from './APComplaints';
import AddParkingZonePage from './AddParkingZonePage';
import { HeaderContext } from '../../contexts/HeaderContext';
import { UserContext } from '../../contexts/UserContext';
import ApplicationAP from './ApplicationAP';

const AdminPath = () => {
  const { setheaderState } = useContext(HeaderContext);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
      setUser('ADMIN');
      setheaderState('ADMIN');
      localStorage.setItem('role', "ADMIN")
  }, [setUser, setheaderState]);

  return (
    <Routes>
        <Route path='/' element={<AdminDashboard/>}/>
        <Route path="/parking-spaces" element={<APParkingSpaces />} />
        <Route path="/complaints" element={<APComplaints />} />
        <Route path="/parking-zones" element={<APParkingZones/>} />
        <Route path="/users" element={<APUsers />} />
        <Route path="/add-parking-zone/:applicationId" element={<AddParkingZonePage />} />
        <Route path="/application" element={<ApplicationAP />} />
        
        <Route path="*" element={<p>Cтраница не найдена</p>} />
    </Routes>
  );
};

export default AdminPath;