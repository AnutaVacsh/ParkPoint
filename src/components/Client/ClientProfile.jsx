import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/clientProfile.css"; // Подключаем обновлённые стили

const ClientProfile = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Запасные данные
  const fallbackUser = { id: 0, email: "mockuser@mail.ru", role: "CLIENT" };
  const fallbackCards = [{ last4: "1234" }, { last4: "5678" }];
  const fallbackComplaints = [
    {
      id: 1,
      complainant: { email: "mock1@mail.ru" },
      accused: { email: "mock-accused@mail.ru" },
      text: "Медленная доставка.",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      complainant: { email: "mock2@mail.ru" },
      accused: { email: "mock-accused2@mail.ru" },
      text: "Некачественный товар.",
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
    };

    fetchData();
  }, [userId]);

  const handleAddCard = () => navigate("/pay");

  return (
    <div className="client-profile">
      <div className="left-column">
        <div className="client-profile-header">
          <div className="avatar" />
          <div>
            <div className="font-bold text-lg">{user?.email || "Загрузка..."}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
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
            <button className="btn-outline-yellow" onClick={handleAddCard}>
              Новая карта
            </button>
          </div>
        </div>
      </div>

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
            <a href="#" className="link-yellow">
              Все жалобы
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
