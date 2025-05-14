import React, { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import "../../css/registerStyle.css";
import { useNavigate } from "react-router-dom";

const AddParkingSpace = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    zoneManagerId: "",
    zoneManagerEmail: "",
    zoneTitle: "",
    zoneAddress: "",
    zoneDescription: "",
    state: "ACTIVE",
    latitude: "",
    longitude: "",
    map: "",         // отдельное поле для карты
    photos: [],      // остальные фото
  });


  const [isMapOpen, setIsMapOpen] = useState(false); // Для отслеживания состояния карты

  const handleMapButtonClick = () => {
    setIsMapOpen(true); // Открыть карту
  };

  const handleMapUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, map: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);

    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(base64Photos => {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...base64Photos]
      }));
    });
  };


  const handleMapClose = () => {
    setIsMapOpen(false); // Закрыть карту
  };

  const handlePlacemarkClick = (coords) => {
    const [latitude, longitude] = coords;

    // Обновляем координаты в форме
    setFormData((prevData) => ({
      ...prevData,
      latitude,
      longitude,
    }));

    handleMapClose(); // Закрываем карту
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parkingZoneCreateDto = {
      zoneManager: {
        id: parseInt(formData.zoneManagerId),
        email: formData.zoneManagerEmail,
        role: "ZONE_MANAGER"
      },
      title: formData.zoneTitle,
      address: formData.zoneAddress,
      description: formData.zoneDescription,
      map: formData.map,
      state: formData.state,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      photos: formData.photos.map((photo, index) => ({
        order: index + 1,
        photoUrl: photo
      }))
    };

    fetch("http://localhost:8080/parking-zones/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parkingZoneCreateDto),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        alert("Парковка добавлена!");
        navigate(-1);
      })
      .catch((err) => console.error("Ошибка при отправке:", err));
  };

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Добавление парковочной зоны</h1>
        <form className="registerForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="zoneManagerEmail" className="formLabel">Email менеджера зоны</label>
            <input
              type="email"
              id="zoneManagerEmail"
              name="zoneManagerEmail"
              className="formInput"
              value={formData.zoneManagerEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="zoneTitle" className="formLabel">Название парковочной зоны</label>
            <input
              type="text"
              id="zoneTitle"
              name="zoneTitle"
              className="formInput"
              value={formData.zoneTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="zoneAddress" className="formLabel">Адрес парковочной зоны</label>
            <input
              type="text"
              id="zoneAddress"
              name="zoneAddress"
              className="formInput"
              value={formData.zoneAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Фото карты</label>
            <input type="file" accept="image/*" className="formInput" onChange={handleMapUpload} />
            {formData.map && (
              <img src={formData.map} alt="Карта" className="photoPreview" />
            )}
          </div>

          <div className="formGroup">
            <label>Остальные фото парковочной зоны</label>
            <input type="file" accept="image/*" className="formInput" multiple onChange={handlePhotoUpload} />
            <div className="photoPreviewContainer">
              {formData.photos.map((photo, i) => (
                <img key={i} src={photo} alt={`photo-${i}`} className="photoPreview" />
              ))}
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="zoneDescription" className="formLabel">Описание зоны</label>
            <textarea
              id="zoneDescription"
              name="zoneDescription"
              className="formInput"
              value={formData.zoneDescription}
              onChange={handleChange}
            />
          </div>

          {/* Модальное окно с картой */}
          {isMapOpen && (
            <div className="mapModal">
              <div className="mapClose" onClick={handleMapClose}>✖</div>
              <div className="mapContainer">
                <YMaps>
                  <Map
                    defaultState={{ center: [51.533562, 46.034257], zoom: 13 }}
                    width="100%" height="100%"
                    onClick={(e) => handlePlacemarkClick(e.get("coords"))}
                  >
                    {formData.latitude && formData.longitude && (
                      <Placemark
                        geometry={[formData.latitude, formData.longitude]}
                        options={{ preset: "islands#blueIcon" }}
                      />
                    )}
                  </Map>
                </YMaps>
              </div>
            </div>
          )}

          {/* Широта и долгота */}
          <div className="formGroup">
            <label htmlFor="latitude" className="formLabel">Широта</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              className="formInput"
              value={formData.latitude}
              onChange={handleChange}
              required
            />{/* Кнопка для открытия карты */}
            <div className="mapIcon" onClick={handleMapButtonClick}/>
          </div>

          <div className="formGroup">
            <label htmlFor="longitude" className="formLabel">Долгота</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              className="formInput"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
            
          </div>

          <div className="formGroup">
            <label htmlFor="state" className="formLabel">Состояние парковочной зоны</label>
            <select
              id="state"
              name="state"
              className="formInput"
              value={formData.state}
              onChange={handleChange}
            >
              <option value="ACTIVE">Активно</option>
              <option value="INACTIVE">Неактивно</option>
            </select>
          </div>

          <button type="submit" className="submitButton">Добавить парковку</button>
        </form>
      </div>
    </div>
  );
};

export default AddParkingSpace;
