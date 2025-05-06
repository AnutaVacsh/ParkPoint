import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/cardForm.css'; // Убедись, что путь к стилям верный

const PayPage = () => {
  const { id, subscriptionParams } = useParams();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardAdded = (e) => {
    e.preventDefault();

    // Можно добавить валидацию здесь
    if (!cardNumber || !expiry || !cvv) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    // Переход к подтверждению
    navigate(`/client/parking/${id}/booking/subscription/confirmation/${subscriptionParams}`);
  };

  return (
    <div className="card-page-container">
      <h1>Добавление новой карты</h1>
      <form onSubmit={handleCardAdded} className="card-form">
        <div className="form-group">
          <label htmlFor="cardNumber">Номер карты</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="**** **** **** ****"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiry">Срок действия</label>
            <input
              type="text"
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="password"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="***"
              required
            />
          </div>
        </div>
        <button type="submit" className="continue-button">Сохранить карту и продолжить</button>
      </form>
    </div>
  );
};

export default PayPage;
