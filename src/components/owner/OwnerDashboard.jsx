import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ownerDashboard.css";

const OwnerDashboard = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Запасные данные
  const fallbackUser = { id: 0, email: "mockuser@mail.ru", role: "OWNER" };
  const fallbackCards = [{ last4: "1234" }, { last4: "5678" }];
  const fallbackComplaints = [
    {
      id: 1,
      complainant: { email: "mock1@mail.ru" },
      accused: { email: "mock-accused@mail.ru" },
      text: "Место было занято, прошу разобраться.",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      complainant: { email: "mock2@mail.ru" },
      accused: { email: "mock-accused2@mail.ru" },
      text: "Неправильно припарковался сосед.",
      status: "RESOLVED",
      createdAt: new Date().toISOString(),
    },
  ];

  // Загрузка данных при монтировании
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const userRes = await fetch(`http://localhost:8080/user/info/${userId}`);
        setUser(userRes.ok ? await userRes.json() : fallbackUser);
      } catch {
        setUser(fallbackUser);
      }

      try {
        const cardsRes = await fetch(`http://localhost:8080/user/get/cards/${userId}`);
        setCards(cardsRes.ok ? await cardsRes.json() : fallbackCards);
      } catch {
        setCards(fallbackCards);
      }

      try {
        const complaintsRes = await fetch(`http://localhost:8080/user/complaints/${userId}`);
        setComplaints(complaintsRes.ok ? await complaintsRes.json() : fallbackComplaints);
      } catch {
        setComplaints(fallbackComplaints);
      }

      try {
        const parkingsRes = await fetch(`http://localhost:8080/parking-spaces/get/user/${userId}`);
        setParkings(parkingsRes.ok ? await parkingsRes.json() : []);
      } catch {
        setParkings([]);
      }
    };

    fetchData();
  }, [userId]);

  const handleAddCard = () => navigate("/pay");
  const handleAddParking = () => navigate("/owner/parkingSpace");

  const handleStatusChange = (id, currentState) => {
    // Определим новое состояние на основе текущего
    const newState = currentState === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  
    fetch(`http://localhost:8080/parking-spaces/state/update?id=${id}&newState=${newState}`, {
      method: "PUT",
    })
      .then((res) => {
        if (res.ok) {
          // Обновляем локальный список парковок
          setParkings((prevParkings) =>
            prevParkings.map((parking) =>
              parking.id === id ? { ...parking, state: newState } : parking
            )
          );
        } else {
          alert("Не удалось обновить статус парковки");
        }
      })
      .catch(() => {
        alert("Произошла ошибка при обновлении статуса парковки");
      });
  };  
  

  const handleEditParking = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/parking-spaces/get/${id}`);
      const data = await res.json();
      setSelectedParking(data);
      setIsModalOpen(true);
    } catch {
      alert("Ошибка при загрузке информации о парковке");
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const payload = {
      id: selectedParking.id,
      order: selectedParking.order,
      hourlyPrice: selectedParking.hourlyPrice,
      dailyPrice: selectedParking.dailyPrice,
      weeklyPrice: selectedParking.weeklyPrice,
      monthlyPrice: selectedParking.monthlyPrice,
      description: selectedParking.description
    };

    try {
      const res = await fetch(`http://localhost:8080/parking-spaces/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setParkings(parkings.map(p => p.id === selectedParking.id ? selectedParking : p));
        closeModal();
      } else {
        alert("Ошибка при сохранении изменений");
      }
    } catch {
      alert("Ошибка при сохранении изменений");
    }
  };

  return (
    <div className="owner-dashboard">
      {/* Левая колонка: Профиль, Карты, Парковки */}
      <div className="left-column">
        <div className="owner-profile">
          <div className="avatar" />
          <div>
            <div className="font-bold text-lg">{user?.email || "Загрузка..."}</div>
          </div>
          <div className="profile-actions">
            <button className="edit-btn">Редактировать профиль</button>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Карты</h2>
          <div className="card-list">
            {cards.map((card, idx) => (
              <div key={idx} className="card">💳 **** **** **** {card.last4}</div>
            ))}
            <button className="btn-outline-yellow" onClick={handleAddCard}>Новая карта</button>
          </div>
        </div>

        <div className="parking-header">
          <h2>Мои парковочные места</h2>
          <button className="btn-outline-yellow" onClick={handleAddParking}>
            ➕ Добавить парковочное место
          </button>
        </div>

        {parkings.map((parking) => (
          <div key={parking.id} className="parking-card">
            <div className="parking-details">
              <h3>{parking.parkingZoneDto.title}</h3>
              <p>{parking.parkingZoneDto.address}</p>
              <p>Номер места: {parking.order}</p>
            </div>

            <div className="parking-actions">
              {["ACTIVE", "INACTIVE"].includes(parking.isAvailable) ? (
                <div className="status-switch">
                  <label htmlFor={`status-toggle-${parking.id}`}>
                    {parking.isAvailable === "ACTIVE" ? "Активна" : "Неактивна"}
                  </label>
                  <input
                    id={`status-toggle-${parking.id}`}
                    type="checkbox"
                    checked={parking.isAvailable === "ACTIVE"}
                    onChange={() => handleStatusChange(parking.id, parking.isAvailable)}
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  {
                    {
                      PENDING: "На модерации",
                      REJECTED: "Отклонена",
                      BAN: "Заблокирована",
                    }[parking.isAvailable] || parking.isAvailable
                  }
                </div>
              )}
              <button
                className="btn-outline-yellow"
                onClick={() => handleEditParking(parking.id)}
              >
                Редактировать
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Правая колонка: Жалобы */}
      <div className="right-column">
        <div className="section complaints">
          <h2 className="section-title">Жалобы</h2>
          <div className="complaints">
            {complaints.map((c) => (
              <div key={c.id} className="complaint">
                <div className="font-bold">
                  {c.complainant?.email}{" "}
                  <span className="font-normal text-xs">
                    {new Date(c.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="mt-2 text-gray-300">{c.text}</div>
              </div>
            ))}
            <a href="#" className="link-yellow">Все жалобы</a>
          </div>
        </div>
      </div>

      {/* Модалка редактирования парковки */}
      {isModalOpen && selectedParking && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedParking.parkingZoneDto.title}</h2>
            <p>Адрес: {selectedParking.parkingZoneDto.address}</p>

            <label>Описание:</label>
            <textarea
              value={selectedParking.description || ""}
              onChange={(e) =>
                setSelectedParking({ ...selectedParking, description: e.target.value })
              }
              rows="4"
              placeholder="Описание парковки..."
            />

            {["hourlyPrice", "dailyPrice", "weeklyPrice", "monthlyPrice"].map((field) => (
              <div key={field}>
                <label>{{
                  hourlyPrice: "Цена за час",
                  dailyPrice: "Цена за день",
                  weeklyPrice: "Цена за неделю",
                  monthlyPrice: "Цена за месяц",
                }[field]}:</label>
                <input
                  type="number"
                  value={selectedParking[field] || ""}
                  onChange={(e) =>
                    setSelectedParking({ ...selectedParking, [field]: e.target.value })
                  }
                  placeholder={`Введите ${field}`}
                />
              </div>
            ))}

            <div className="modal-actions">
              <button className="btn-yellow" onClick={handleSaveChanges}>
                Сохранить
              </button>
              <button className="btn-outline-yellow" onClick={closeModal}>
                Отменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
