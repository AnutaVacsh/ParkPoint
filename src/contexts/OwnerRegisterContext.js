import React, { createContext, useState, useContext } from 'react';

const OwnerRegisterContext = createContext();

export const useOwnerRegister = () => useContext(OwnerRegisterContext);

export const OwnerRegisterProvider = ({ children }) => {
  const [registerData, setRegisterData] = useState({
    login: '',
    password: '',
    phone: '',
    email: '',
    parkingZone: '',
    spaceDescription: '',
    photos: '',
    hourlyPrice: '',
    dailyPrice: '',
    weeklyPrice: '',
    monthlyPrice: ''
  });

  const updateRegisterData = (newData) => {
    setRegisterData((prevData) => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <OwnerRegisterContext.Provider value={{ registerData, updateRegisterData }}>
      {children}
    </OwnerRegisterContext.Provider>
  );
};
