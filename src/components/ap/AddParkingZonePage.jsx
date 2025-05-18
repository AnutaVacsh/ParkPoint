import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/registerStyle.css";

const AddParkingZonePage = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const [formData, setFormData] = useState({
    zoneManagerId: "",
    zoneManagerEmail: "",
    zoneTitle: "",
    zoneAddress: "",
    zoneDescription: "",
    state: "ACTIVE",
    latitude: "",
    longitude: "",
    map: "",
    photos: [],
  });

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Модальное окно для сообщения
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (applicationId && applicationId !== "0") {
      setLoading(true);
      fetch(`http://localhost:8080/application/get/${applicationId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка при загрузке заявки");
          return res.json();
        })
        .then((data) => {
          setFormData({
            zoneManagerId: data.zoneManager?.id ? String(data.zoneManager.id) : "",
            zoneManagerEmail: data.email || "",
            zoneTitle: data.title || "",
            zoneAddress: data.address || "",
            zoneDescription: data.description || "",
            state: data.state || "ACTIVE",
            latitude: data.latitude || "",
            longitude: data.longitude || "",
            map: data.map || "",
            photos: data.photos?.map(photo => photo.photoUrl) || [],
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [applicationId]);

  const handleMapButtonClick = () => setIsMapOpen(true);
  const handleMapClose = () => setIsMapOpen(false);

  const handleMapUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, map: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((base64Photos) => {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...base64Photos],
      }));
    });
  };

  const handlePlacemarkClick = (coords) => {
    const [latitude, longitude] = coords;
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
    handleMapClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parkingZoneCreateDto = {
      zoneManager: {
        id: parseInt(formData.zoneManagerId),
        email: formData.zoneManagerEmail,
        role: "ZONE_MANAGER",
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
        photoUrl: photo,
      })),
    };

    try {
      const createRes = await fetch("http://localhost:8080/parking-zones/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parkingZoneCreateDto),
      });

      if (!createRes.ok) throw new Error("Ошибка при создании парковочной зоны");

      // Если это создание из заявки — обновляем статус заявки
      if (applicationId && applicationId !== "0") {
        const statusRes = await fetch(`http://localhost:8080/application/update/state/${applicationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify("APPROVED"),
        });

        if (!statusRes.ok) throw new Error("Не удалось обновить статус заявки");
      }

      setModalMessage("Парковка добавлена!");
      setIsModalOpen(true);
    } catch (err) {
      console.error("Ошибка:", err);
      setModalMessage("Ошибка: не удалось добавить парковку или обновить заявку");
      setIsModalOpen(true);
    }
  };


  const closeModal = () => {
    setIsModalOpen(false);
    if (modalMessage === "Парковка добавлена!") {
      navigate(-1); // Вернуться назад после успешного подтверждения
    }
  };

  if (loading) return <div>Загрузка данных заявки...</div>;
  if (error) return <div style={{ color: "red" }}>Ошибка: {error}</div>;

  return (
    <div className="registerPage">
      <div className="registerContent">
        <h1 className="registerTitle">Добавление парковочной зоны</h1>
        <form className="registerForm" onSubmit={handleSubmit}>

          <div className="formGroup">
            <label htmlFor="zoneManagerEmail" className="formLabel">
              Email менеджера зоны
            </label>
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
            <label htmlFor="zoneTitle" className="formLabel">
              Название парковочной зоны
            </label>
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
            <label htmlFor="zoneAddress" className="formLabel">
              Адрес парковочной зоны
            </label>
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
            <input
              type="file"
              accept="image/*"
              className="formInput"
              onChange={handleMapUpload}
            />
            {formData.map && (
              <img src={formData.map} alt="Карта" className="photoPreview" />
            )}
          </div>

          <div className="formGroup">
            <label>Остальные фото парковочной зоны</label>
            <input
              type="file"
              accept="image/*"
              className="formInput"
              multiple
              onChange={handlePhotoUpload}
            />
            <div className="photoPreviewContainer">
              {formData.photos.map((photo, i) => (
                <img key={i} src={photo} alt={`photo-${i}`} className="photoPreview" />
              ))}
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="zoneDescription" className="formLabel">
              Описание зоны
            </label>
            <textarea
              id="zoneDescription"
              name="zoneDescription"
              className="formInput"
              value={formData.zoneDescription}
              onChange={handleChange}
            />
          </div>

          {/* Модальное окно */}
        {isModalOpen && (
          <div className="modalOverlay">
            <div className="modalContent">
              <p>{modalMessage}</p>
              <button onClick={closeModal} className="modalCloseButton">
                Закрыть
              </button>
            </div>
          </div>
        )}

          {isMapOpen && (
            <div className="mapModal">
              <div className="mapClose" onClick={handleMapClose}>
                ✖
              </div>
              <div className="mapContainer">
                <YMaps>
                  <Map
                    defaultState={{ center: [51.533562, 46.034257], zoom: 13 }}
                    width="100%"
                    height="100%"
                    onClick={(e) => handlePlacemarkClick(e.get("coords"))}
                  >
                    {formData.latitude && formData.longitude && (
                      <Placemark
                        geometry={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
                        options={{ preset: "islands#blueIcon" }}
                      />
                    )}
                  </Map>
                </YMaps>
              </div>
            </div>
          )}

          <div className="formGroup">
            <label htmlFor="latitude" className="formLabel">
              Широта
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              className="formInput"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="any"
            />
            <div className="mapIcon" onClick={handleMapButtonClick} />
          </div>

          <div className="formGroup">
            <label htmlFor="longitude" className="formLabel">
              Долгота
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              className="formInput"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="any"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="state" className="formLabel">
              Состояние парковочной зоны
            </label>
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

          <button type="submit" className="submitButton">
            Добавить парковку
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddParkingZonePage;
