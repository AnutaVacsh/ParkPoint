import React, { useContext, useEffect } from 'react';
import '../css/homeStyle.css';
import { Link } from 'react-router-dom';
import { HeaderContext } from '../contexts/HeaderContext';
import { UserContext } from '../contexts/UserContext';

const Home = () => {
  const { setheaderState } = useContext(HeaderContext);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
      localStorage.setItem("role", "GUEST")
      setUser('GUEST');
      setheaderState('GUEST');
      console.log("GUEST")
  }, [setUser, setheaderState]);

  return (
    <div className="home">
      <div className="homeContent">
        <h1 className="welcomeTitle">Добро пожаловать в ParkPoint!</h1>
        <h2 className="subtitle">Удобная аренда парковочных мест для всех!</h2>
        <p className="description">
          Присоединяйтесь к нам и получите удобство аренды парковочных мест уже сегодня!
        </p>
        <Link to={"chooseRolePage"} className="registerButton">Зарегистрироваться</Link>
      </div>
      <div className="imageContainer">
        <img
          src={require('../img/YelowCar.png')}
          alt="Parking"
          className="homeImage"
        />
      </div>
    </div>
  );
};

export default Home;