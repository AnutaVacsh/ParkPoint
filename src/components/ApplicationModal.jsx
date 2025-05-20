import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import "../css/registerStyle.css";

const Application = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    emailText: "",
    title: "",
    address: "",
    latitude: null,
    longitude: null,
    description: "",
  });

  const [notifications, setNotifications] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [mapState, setMapState] = useState({
    center: [51.533562, 46.034257],
    zoom: 13,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMapClick = (event) => {
    const coords = event.get("coords");
    setFormData((prev) => ({
      ...prev,
      latitude: coords[0],
      longitude: coords[1],
    }));
    setMapState(prev => ({
      ...prev,
      center: coords,
      zoom: 16
    }));

    setIsMapOpen(false);
  };

  const handleOpenMap = () => setIsMapOpen(true);
  const handleMapClose = () => setIsMapOpen(false);

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (!text) return setSearchResults([]);

    try {
      setIsSearching(true);
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=79c4dca7-80ed-4233-b785-8cce6955f1b4&format=json&geocode=${encodeURIComponent(text)}&results=15`
      );
      const data = await response.json();
      const found = data.response.GeoObjectCollection.featureMember;
      setSearchResults(found || []);
    } catch (e) {
      console.warn('Ошибка поиска по адресу:', e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result) => {
    const coords = result.GeoObject.Point.pos.split(' ').map(Number).reverse();
    setFormData(prev => ({
      ...prev,
      latitude: coords[0],
      longitude: coords[1],
      address: result.GeoObject.metaDataProperty.GeocoderMetaData.text
    }));
    setMapState(prev => ({
      ...prev,
      center: coords,
      zoom: 16
    }));
    setSearchQuery(result.GeoObject.metaDataProperty.GeocoderMetaData.text);
    setSearchResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotifications([]);

    const { email, emailText, title, address, latitude, longitude } = formData;
    if (!email.trim()) {
      setNotifications((prev) => [...prev, "Введите email."]);
      return;
    }
    if (!emailText.trim()) {
      setNotifications((prev) => [...prev, "Введите текст email."]);
      return;
    }
    if (!title.trim()) {
      setNotifications((prev) => [...prev, "Введите заголовок."]);
      return;
    }
    if (!address.trim()) {
      setNotifications((prev) => [...prev, "Введите адрес."]);
      return;
    }
    if (latitude === null || longitude === null) {
      setNotifications((prev) => [...prev, "Выберите точку на карте."]);
      return;
    }

    const requestBody = { ...formData };

    fetch("http://localhost:8080/application/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setModalMessage("Ваша заявка отправлена");
      })
      .catch(() => {
        setModalMessage("Ошибка при отправке заявки. Попробуйте позже.");
      });
  };

  const closeModal = () => {
    if (modalMessage === "Ваша заявка отправлена") {
      navigate(-1);
    }
    setModalMessage(null);
  };

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Заявка на парковочное место</h1>

        <form className="registerForm" onSubmit={handleSubmit}>
          {/* ... остальные поля формы без изменений ... */}
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="formInput"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="emailText" className="formLabel">
              Текст email
            </label>
            <textarea
              id="emailText"
              name="emailText"
              className="formInput"
              value={formData.emailText}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="title" className="formLabel">
              Название зоны
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="formInput"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="address" className="formLabel">
              Адрес
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="formInput"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label className="formLabel">Выбранная точка на карте:</label>
            <div>
              {formData.latitude && formData.longitude
                ? `Широта: ${formData.latitude.toFixed(6)}, Долгота: ${formData.longitude.toFixed(6)}`
                : "Точка не выбрана"}
            </div>
            <div className="mapIcon" onClick={handleOpenMap} />
          </div>

          <div className="formGroup">
            <label htmlFor="description" className="formLabel">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              className="formInput"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="notifications">
            {notifications.map((note, idx) => (
              <div key={idx} className="notification">
                {note}
              </div>
            ))}
          </div>

          <button type="submit" className="submitButton">
            Отправить заявку
          </button>
        </form>

        {isMapOpen && (
          <div className="mapModal">
            <div className="mapClose" onClick={handleMapClose}>
              ✖
            </div>
            <div className="mapContainer" style={{ width: "100%", height: "400px" }}>
              <YMaps query={{ apikey: "79c4dca7-80ed-4233-b785-8cce6955f1b4" }}>
                <Map
                  state={mapState}
                  width="100%"
                  height="100%"
                  onClick={handleMapClick}
                  instanceRef={mapRef}
                >
                  {formData.latitude && formData.longitude && (
                    <Placemark 
                      geometry={[formData.latitude, formData.longitude]}
                      options={{ preset: "islands#redDotIcon" }}
                      onClick={handleMapClose}
                    />
                  )}
                </Map>
              </YMaps>
            </div>
            
            <div className="searchContainer">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Поиск адреса..."
                className="searchInput"
              />
              {isSearching && <div className="searchLoading">Поиск...</div>}
              
              {searchResults.length > 0 && (
                <ul className="searchResults">
                  {searchResults.map((result, index) => (
                    <li 
                      key={index} 
                      className="searchResultItem"
                      onClick={() => handleSelectResult(result)}
                    >
                      {result.GeoObject.metaDataProperty.GeocoderMetaData.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="mapInstructions">
              Нажмите на карту или найдите адрес с помощью поиска
            </div>
          </div>
        )}

        {modalMessage && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <p>{modalMessage}</p>
              <button onClick={closeModal} style={modalStyles.button}>
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  modal: {
    backgroundColor: "#1D2329",
    padding: "25px 30px",
    borderRadius: "8px",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  button: {
    marginTop: "15px",
    padding: "8px 15px",
    cursor: "pointer",
  },
};

export default Application;