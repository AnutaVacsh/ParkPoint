import React, { useState } from 'react';
import '../../css/clientProfile.css';

const ClientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
    complaints: [
      { id: 1, text: "Медленная доставка", date: "2023-10-15" },
      { id: 2, text: "Некачественный товар", date: "2023-11-02" },
    ],
    cards: [
      { id: 1, number: "**** **** **** 1234", type: "Visa" },
      { id: 2, number: "**** **** **** 5678", type: "MasterCard" },
    ],
  });

  const [newCard, setNewCard] = useState({ number: "", type: "" });

  const handleEdit = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAddCard = () => {
    if (newCard.number && newCard.type) {
      setUserData({
        ...userData,
        cards: [...userData.cards, { id: Date.now(), ...newCard }],
      });
      setNewCard({ number: "", type: "" });
    }
  };

  return (
    <div className="client-profile">
      <div className="profile-header">
        <h1>Профиль клиента</h1>
        <button onClick={handleEdit} className="edit-button">
          {isEditing ? "Сохранить" : "Редактировать"}
        </button>
      </div>

      <div className="profile-content">
        {/* Основная информация */}
        <div className="user-info">
          <h2>Личные данные</h2>
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Имя"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                placeholder="Телефон"
              />
            </div>
          ) : (
            <div className="info-display">
              <p><strong>Имя:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Телефон:</strong> {userData.phone}</p>
            </div>
          )}
        </div>

        {/* Карты пользователя */}
        <div className="user-cards">
          <h2>Карты</h2>
          <div className="cards-list">
            {userData.cards.map((card) => (
              <div key={card.id} className="card-item">
                <p><strong>{card.type}</strong>: {card.number}</p>
              </div>
            ))}
          </div>
          <div className="add-card">
            <input
              type="text"
              placeholder="Номер карты"
              value={newCard.number}
              onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Тип (Visa/MC)"
              value={newCard.type}
              onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
            />
            <button onClick={handleAddCard}>Добавить карту</button>
          </div>
        </div>

        {/* Жалобы */}
        <div className="user-complaints">
          <h2>Жалобы</h2>
          <div className="complaints-list">
            {userData.complaints.map((complaint) => (
              <div key={complaint.id} className="complaint-item">
                <p><strong>{complaint.date}</strong>: {complaint.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;