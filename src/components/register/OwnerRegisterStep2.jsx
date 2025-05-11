import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerRegister } from '../../contexts/OwnerRegisterContext';
import '../../css/registerStyle.css';
import { registerOwner as apiRegisterOwner } from '../../api/AuthApi'; // API для отправки данных владельца
import { HeaderContext } from '../../contexts/HeaderContext';
import { UserContext } from '../../contexts/UserContext';

const OwnerRegisterStep2 = () => {
  const { setheaderState } = useContext(HeaderContext);
  const { setUser } = useContext(UserContext);
  const { registerData, updateRegisterData } = useOwnerRegister(); // Получаем данные из контекста
  const [parkingZone, setParkingZone] = useState(1);
  const [spaceDescription, setSpaceDescription] = useState('');
  const [space, setPhotos] = useState('');
  const [hourlyPrice, setHourlyPrice] = useState('');
  const [dailyPrice, setDailyPrice] = useState('');
  const [weeklyPrice, setWeeklyPrice] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Обработчик для кнопки "Выбрать на карте"
  const handleMapButtonClick = () => {
    // Пока просто выводим в консоль, что карта должна открыться
    console.log("Открытие карты для выбора парковочной зоны...");
    // Здесь можно будет добавить логику для открытия карты
  };

  const registerOwner = async () => {
    const ownerRegisterRequest = {
      registerRequestDto: {
        email: registerData.email,
        password: registerData.password,
        role: "OWNER", 
      },
      parkingSpaceRequestDto: {
        id: null,
        idOwner: null,
        order: space,
        hourlyPrice: parseInt(hourlyPrice),
        dailyPrice: parseInt(dailyPrice),
        weeklyPrice: parseInt(weeklyPrice),
        monthlyPrice: parseInt(monthlyPrice),
        isAvailable: "PENDING",
        description: spaceDescription,
        parkingZoneId: parkingZone,
      }
    };
  
    try {
      const result = await apiRegisterOwner(ownerRegisterRequest);
      console.log(result);
      localStorage.setItem("role", result.role)
      setheaderState(result.role);
      setUser(result.role);
      navigate('/owner');
    } catch (err) {
        let message = 'Ошибка регистрации парковочного места';
      
        if (err.response && err.response.data) {
          if (typeof err.response.data === 'string') {
            message = err.response.data;
          } else if (err.response.data.message) {
            message = err.response.data.message;
          }
        }
      
        setError(message);
        console.error('Owner registration error:', err);
    }
  };

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Добавление парковочного места</h1>
        <form className="registerForm" onSubmit={(e) => e.preventDefault()}>
          <div className="formGroup">
            <label htmlFor="parkingZone" className="formLabel">Парковочная зона</label>
            <div className="inputWithIcon">
                <input
                    type="text"
                    id="parkingZone"
                    className="formInput"
                    value={parkingZone}
                    onChange={(e) => setParkingZone(e.target.value)}
                    required
                />
                <div
                    className="mapIcon"
                    onClick={handleMapButtonClick}
                ></div>
                </div>
          </div>
          <div className="formGroup">
            <label htmlFor="spaceDescription" className="formLabel">Описание места</label>
            <textarea
              id="spaceDescription"
              className="formInput"
              value={spaceDescription}
              onChange={(e) => setSpaceDescription(e.target.value)}
              required
            />
          </div>

          {/* <div className="formGroup">
            <label htmlFor="photos" className="formLabel">Фотографии</label>
            <input
              type="file"
              id="photos"
              className="formInput"
              onChange={(e) => setPhotos(e.target.files)}
            />
          </div> */}

          <div className="formGroup">
            <label htmlFor="photos" className="formLabel">Парковочная зона</label>
            <input
              type="number"
              id="photos"
              className="formInput"
              onChange={(e) => setPhotos(e.target.value)}
            />
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="hourlyPrice" className="formLabel">Стоимость за час</label>
              <input
                type="number"
                id="hourlyPrice"
                className="formInput"
                value={hourlyPrice}
                onChange={(e) => setHourlyPrice(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="dailyPrice" className="formLabel">Стоимость за день</label>
              <input
                type="number"
                id="dailyPrice"
                className="formInput"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="weeklyPrice" className="formLabel">Стоимость за неделю</label>
              <input
                type="number"
                id="weeklyPrice"
                className="formInput"
                value={weeklyPrice}
                onChange={(e) => setWeeklyPrice(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="monthlyPrice" className="formLabel">Стоимость за месяц</label>
              <input
                type="number"
                id="monthlyPrice"
                className="formInput"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button
            type="button"
            className="submitButton"
            onClick={registerOwner}
          >
            Завершить регистрацию
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerRegisterStep2;
