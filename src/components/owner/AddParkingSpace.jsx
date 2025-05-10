import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps"; // Используем Yandex Maps
import "../../css/registerStyle.css";
import { mockParkingZones } from "../../dto/mock/mockParkingZones";

const AddParkingSpace = () => {
  const navigate = useNavigate();
  const [parkingZones, setParkingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [formData, setFormData] = useState({
    order: "",
    hourlyPrice: "",
    dailyPrice: "",
    weeklyPrice: "",
    monthlyPrice: "",
    isAvailable: "AVAILABLE", // Можно установить по умолчанию
    description: "",
    parkingZoneId: null,
    latitude: null,
    longitude: null,
  });
  const [isMapOpen, setIsMapOpen] = useState(false); // Для открытия карты
  const [existingParkingSpaces, setExistingParkingSpaces] = useState([]); // Для хранения парковочных мест в выбранной зоне
  const [notifications, setNotifications] = useState([]); // Для хранения уведомлений

  useEffect(() => {
    // Получаем доступные парковочные зоны с сервера
    const fetchParkingZones = async () => {
      try {
        const response = await fetch('http://localhost:8080/parking-zones/get/list');
        if (!response.ok) throw new Error();
        const data = await response.json();
        console.log("Зоны парковок получены:", data);
        setParkingZones(data);
      } catch (error) {
        console.warn('Ошибка при загрузке парковок, используем моки');
        setParkingZones(mockParkingZones);
      }
    };

    fetchParkingZones();
  }, []);

  // Функция для получения полной информации о парковочной зоне по id
  const fetchParkingZoneDetails = async (zoneId) => {
    try {
      const response = await fetch(`http://localhost:8080/parking-zones/get/${zoneId}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      console.log("Детали зоны парковки получены:", data);
      setSelectedZone(data);
    } catch (error) {
      console.warn('Ошибка при получении данных зоны парковки', error);
    }
  };

  // Функция для получения всех парковочных мест в выбранной зоне
  const fetchParkingSpacesInZone = async (zoneId) => {
    try {
      const response = await fetch(`http://localhost:8080/parking-spaces/get/list/${zoneId}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setExistingParkingSpaces(data); // Сохраняем парковочные места в зоне
    } catch (error) {
      console.warn('Ошибка при получении парковочных мест зоны', error);
    }
  };

  // Проверяем, существует ли парковочное место с таким номером
  const checkIfParkingSpaceExists = (order) => {
    return existingParkingSpaces.some((space) => space.parkingSpaceDto.order == order);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMapButtonClick = () => {
    console.log("Открытие карты");
    setIsMapOpen(true); // Открываем карту
  };

  const handleMapClose = () => {
    console.log("Закрытие карты");
    setIsMapOpen(false); // Закрываем карту
  };

  const handleMapClick = (e) => {
    const coordinates = e.get("coords"); // Получаем координаты клика
    console.log("Клик по карте, координаты:", coordinates);
    setFormData((prevData) => ({
      ...prevData,
      latitude: coordinates[0],
      longitude: coordinates[1],
    }));
    setIsMapOpen(false); // Закрываем карту
  };

  // Функция для обработки выбора маркера на карте
  const handlePlacemarkClick = async (zone) => {
    console.log("Выбор зоны с маркером:", zone);

    // Сделаем запрос на сервер по id выбранной зоны
    await fetchParkingZoneDetails(zone.id);

    // Получим все парковочные места в зоне
    await fetchParkingSpacesInZone(zone.id);

    // Обновим данные формы выбранной зоной
    setFormData((prevData) => ({
      ...prevData,
      parkingZoneId: zone.id,
      latitude: zone.latitude,
      longitude: zone.longitude,
    }));

    setIsMapOpen(false); // Закрываем карту после выбора зоны
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const { order, hourlyPrice, dailyPrice, weeklyPrice, monthlyPrice, parkingZoneId, latitude, longitude } = formData;
  
    if (!parkingZoneId) {
      setNotifications((prev) => [...prev, "Выберите парковочную зону."]);
      return;
    }
  
    if (!order) {
      setNotifications((prev) => [...prev, "Укажите номер парковки."]);
      return;
    }
  
    // Проверяем, существует ли место с таким номером
    if (checkIfParkingSpaceExists(order)) {
      setNotifications((prev) => [...prev, `Парковочное место с номером ${order} уже существует в этой зоне.`]);
      return;
    }
  
    if (!hourlyPrice && !dailyPrice && !weeklyPrice && !monthlyPrice) {
      setNotifications((prev) => [...prev, "Укажите хотя бы одну цену (по часу, за день, неделю или месяц)."]);
      return;
    }
  
    if (latitude === null || longitude === null) {
      setNotifications((prev) => [...prev, "Выберите точку на карте."]);
      return;
    }
  
    const parkingSpaceDto = {
      order: parseInt(order),
      idOwner: localStorage.getItem("userId"),
      hourlyPrice: hourlyPrice ? parseInt(hourlyPrice) : null,
      dailyPrice: dailyPrice ? parseInt(dailyPrice) : null,
      weeklyPrice: weeklyPrice ? parseInt(weeklyPrice) : null,
      monthlyPrice: monthlyPrice ? parseInt(monthlyPrice) : null,
      isAvailable: "PENDING",
      description: formData.description,
      parkingZoneId,
      latitude,
      longitude,
    };
    console.log(parkingSpaceDto)
  
    fetch("http://localhost:8080/parking-spaces/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parkingSpaceDto),
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then(() => {
        console.log("Парковка успешно добавлена!");
        navigate("/owner/profile"); // Перенаправление на страницу с парковочными местами
      })
      .catch((err) => console.error("Ошибка добавления парковочного места:", err));
  };

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Добавление парковочного места</h1>
        <form className="registerForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="parkingZone" className="formLabel">Парковочная зона</label>
            <div className="inputWithIcon">
              <select
                id="parkingZone"
                name="parkingZoneId"
                className="formInput"
                value={formData.parkingZoneId}
                onChange={handleChange}
                required
              >
                <option value="">Выберите парковочную зону</option>
                {parkingZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {selectedZone && selectedZone.title}
                  </option>
                ))}
              </select>
              <div
                className="mapIcon"
                onClick={handleMapButtonClick}
              >
              </div>
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="order" className="formLabel">Номер парковки</label>
            <input
              type="number"
              id="order"
              name="order"
              className="formInput"
              value={formData.order}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="hourlyPrice" className="formLabel">Цена за час</label>
            <input
              type="number"
              id="hourlyPrice"
              name="hourlyPrice"
              className="formInput"
              value={formData.hourlyPrice}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="dailyPrice" className="formLabel">Цена за день</label>
            <input
              type="number"
              id="dailyPrice"
              name="dailyPrice"
              className="formInput"
              value={formData.dailyPrice}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="weeklyPrice" className="formLabel">Цена за неделю</label>
            <input
              type="number"
              id="weeklyPrice"
              name="weeklyPrice"
              className="formInput"
              value={formData.weeklyPrice}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="monthlyPrice" className="formLabel">Цена за месяц</label>
            <input
              type="number"
              id="monthlyPrice"
              name="monthlyPrice"
              className="formInput"
              value={formData.monthlyPrice}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="description" className="formLabel">Описание</label>
            <textarea
              id="description"
              name="description"
              className="formInput"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="notifications">
        {notifications.map((note, index) => (
          <div key={index} className="notification">{note}</div>
        ))}
      </div>

          <button type="submit" className="submitButton">Добавить парковку</button>
        </form>
      </div>

      

      {isMapOpen && (
        <div className="mapModal">
          <div className="mapClose" onClick={handleMapClose}>✖</div>
          <div className="mapContainer">
            <YMaps>
              <Map defaultState={{ center: [51.533562, 46.034257], zoom: 13 }} width="100%" height="100%">
                {parkingZones.map((zone) => (
                  <Placemark
                    key={zone.id}
                    geometry={[zone.latitude, zone.longitude]}
                    properties={{
                      iconContent: `${zone.parkingSpacesCount} мест`,
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
  );
};

export default AddParkingSpace;
