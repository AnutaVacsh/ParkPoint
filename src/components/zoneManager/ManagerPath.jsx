import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { HeaderContext } from '../../contexts/HeaderContext';
import { UserContext } from '../../contexts/UserContext';
import ZoneManagerDashboard from './ZoneManagerDashboard';
import ZMParkingZones from './ZMParkingZones';

const ManagerPath = () => {
  const { setheaderState } = useContext(HeaderContext);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
      setUser('ZONE_MANAGER');
      setheaderState('ZONE_MANAGER');
      localStorage.setItem('role', "ZONE_MANAGER")
  }, [setUser, setheaderState]);

  return (
    <Routes>
        <Route path='/' element={<ZoneManagerDashboard />}/>
        {/* <Route path="/parking-spaces" element={<ZMParkingSpaces />} /> */}
        <Route path="/parking-zones" element={<ZMParkingZones/>} />
        {/* <Route path="/users" element={<APUsers />} /> */}
        
        <Route path="*" element={<p>Cтраница не найдена</p>} />
    </Routes>
  );
};

export default ManagerPath;