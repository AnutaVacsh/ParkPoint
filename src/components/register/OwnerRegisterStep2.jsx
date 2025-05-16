import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerRegister } from '../../contexts/OwnerRegisterContext';
import '../../css/registerStyle.css';
import { registerOwner as apiRegisterOwner } from '../../api/AuthApi';
import { HeaderContext } from '../../contexts/HeaderContext';
import { UserContext } from '../../contexts/UserContext';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const OwnerRegisterStep2 = () => {
  const { setheaderState } = useContext(HeaderContext);
  const { setUser } = useContext(UserContext);
  const { registerData } = useOwnerRegister();

  const [parkingZones, setParkingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [existingParkingSpaces, setExistingParkingSpaces] = useState([]);

  const [form, setForm] = useState({
    parkingZoneId: '',
    spaceNumber: '',
    spaceDescription: '',
    hourlyPrice: '',
    dailyPrice: '',
    weeklyPrice: '',
    monthlyPrice: '',
  });

  const [error, setError] = useState(null);
  const [loadingZones, setLoadingZones] = useState(false);
  const [loadingZoneDetails, setLoadingZoneDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isMapOpen, setIsMapOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadZones() {
      setLoadingZones(true);
      try {
        const response = await fetch('http://localhost:8080/parking-zones/get/list');
        if (!response.ok) throw new Error('Ошибка загрузки парковочных зон');
        const data = await response.json();
        setParkingZones(data);
      } catch {
        setParkingZones([
          { id: 1, title: 'Зона 1', latitude: 51.533562, longitude: 46.034257, parkingSpacesCount: 10 },
          { id: 2, title: 'Зона 2', latitude: 51.537562, longitude: 46.038257, parkingSpacesCount: 5 },
        ]);
      } finally {
        setLoadingZones(false);
      }
    }
    loadZones();
  }, []);

  useEffect(() => {
    async function loadZoneDetails(zoneId) {
      if (!zoneId) {
        setSelectedZone(null);
        setExistingParkingSpaces([]);
        return;
      }
      setLoadingZoneDetails(true);
      try {
        const [zoneRes, spacesRes] = await Promise.all([
          fetch(`http://localhost:8080/parking-zones/get/${zoneId}`),
          fetch(`http://localhost:8080/parking-spaces/get/list/${zoneId}`),
        ]);

        if (!zoneRes.ok) throw new Error('Ошибка загрузки деталей зоны');
        if (!spacesRes.ok) throw new Error('Ошибка загрузки парковочных мест');

        const zoneData = await zoneRes.json();
        const spacesData = await spacesRes.json();

        setSelectedZone(zoneData);
        setExistingParkingSpaces(spacesData);
      } catch (err) {
        console.warn(err);
        setSelectedZone(null);
        setExistingParkingSpaces([]);
      } finally {
        setLoadingZoneDetails(false);
      }
    }

    loadZoneDetails(form.parkingZoneId);
  }, [form.parkingZoneId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setError(null);
  };

  // Открытие карты
  const handleMapButtonClick = () => {
    setIsMapOpen(true);
  };

  // Закрытие карты
  const handleMapClose = () => {
    setIsMapOpen(false);
  };

  // Выбор зоны по клику на маркер
  const handlePlacemarkClick = (zone) => {
    setForm((prev) => ({ ...prev, parkingZoneId: zone.id.toString() }));
    setIsMapOpen(false);
  };

  const validateForm = () => {
    if (!form.parkingZoneId) {
      setError('Пожалуйста, выберите парковочную зону');
      return false;
    }
    if (!form.spaceNumber) {
      setError('Введите номер парковочного места');
      return false;
    }
    if (!form.spaceDescription.trim()) {
      setError('Введите описание парковочного места');
      return false;
    }
    return true;
  };

  const registerOwner = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    const ownerRegisterRequest = {
      registerRequestDto: {
        email: registerData.email,
        password: registerData.password,
        role: 'OWNER',
      },
      parkingSpaceRequestDto: {
        id: null,
        idOwner: null,
        order: parseInt(form.spaceNumber, 10),
        hourlyPrice: form.hourlyPrice ? parseInt(form.hourlyPrice, 10)*100 : 0,
        dailyPrice: form.dailyPrice ? parseInt(form.dailyPrice, 10)*100 : 0,
        weeklyPrice: form.weeklyPrice ? parseInt(form.weeklyPrice, 10)*100 : 0,
        monthlyPrice: form.monthlyPrice ? parseInt(form.monthlyPrice, 10)*100 : 0,
        isAvailable: 'PENDING',
        description: form.spaceDescription.trim(),
        parkingZoneId: parseInt(form.parkingZoneId, 10),
      },
    };

    try {
      const result = await apiRegisterOwner(ownerRegisterRequest);
      localStorage.setItem('role', result.role);
      localStorage.setItem('userId', result.id);
      setheaderState(result.role);
      setUser(result.role);
      navigate('/owner');
    } catch (err) {
      let message = 'Ошибка регистрации парковочного места';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') message = err.response.data;
        else if (err.response.data.message) message = err.response.data.message;
      }
      setError(message);
      console.error('Owner registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Добавление парковочного места</h1>

        <form className="registerForm" onSubmit={(e) => e.preventDefault()}>
          <div className="formGroup">
            <label htmlFor="parkingZoneId" className="formLabel">
              Парковочная зона
            </label>
            <div className="inputWithIcon">
              {loadingZones ? (
                <div>Загрузка зон...</div>
              ) : (
                <select
                  id="parkingZoneId"
                  className="formInput"
                  value={form.parkingZoneId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите зону</option>
                  {parkingZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {selectedZone ? selectedZone.title : zone.id }
                    </option>
                  ))}
                </select>
              )}
              <div
                className="mapIcon"
                onClick={handleMapButtonClick}
                title="Выбрать на карте"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleMapButtonClick()}
              />
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="spaceNumber" className="formLabel">
              Номер парковочного места
            </label>
            <input
              type="number"
              id="spaceNumber"
              className="formInput"
              value={form.spaceNumber}
              onChange={handleChange}
              required
              min={1}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="spaceDescription" className="formLabel">
              Описание места
            </label>
            <textarea
              id="spaceDescription"
              className="formInput"
              value={form.spaceDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="hourlyPrice" className="formLabel">
                Стоимость за час
              </label>
              <input
                type="number"
                id="hourlyPrice"
                className="formInput"
                value={form.hourlyPrice}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="dailyPrice" className="formLabel">
                Стоимость за день
              </label>
              <input
                type="number"
                id="dailyPrice"
                className="formInput"
                value={form.dailyPrice}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="weeklyPrice" className="formLabel">
                Стоимость за неделю
              </label>
              <input
                type="number"
                id="weeklyPrice"
                className="formInput"
                value={form.weeklyPrice}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="monthlyPrice" className="formLabel">
                Стоимость за месяц
              </label>
              <input
                type="number"
                id="monthlyPrice"
                className="formInput"
                value={form.monthlyPrice}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button
            type="button"
            className="submitButton"
            onClick={registerOwner}
            disabled={submitting}
          >
            {submitting ? 'Регистрация...' : 'Завершить регистрацию'}
          </button>
        </form>

        {isMapOpen && (
          <div className="mapModal">
            <div className="mapClose" onClick={handleMapClose} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && handleMapClose()}>
              ✖
            </div>
            <div className="mapContainer" style={{ width: '100%', height: '400px' }}>
              <YMaps>
                <Map defaultState={{ center: [51.533562, 46.034257], zoom: 13 }} width="100%" height="100%">
                  {parkingZones.map((zone) => (
                    <Placemark
                      key={zone.id}
                      geometry={[zone.latitude, zone.longitude]}
                      properties={{
                        iconContent: `${zone.parkingSpacesCount || 0} мест`,
                      }}
                      options={{
                        preset: 'islands#blueCircleIconWithCaption',
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePlacemarkClick(zone)}
                    />
                  ))}
                </Map>
              </YMaps>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerRegisterStep2;
