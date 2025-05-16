import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/cardForm.css';

const PayPage = () => {
  const { id, subscriptionParams } = useParams();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, '')                  // Удалить всё, кроме цифр
      .substring(0, 16)                    // Ограничить 16 цифрами
      .replace(/(.{4})/g, '$1 ')           // Пробел каждые 4 цифры
      .trim();                             // Удалить лишний пробел
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const formatExpiry = (value) => {
    let cleaned = value.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length >= 3) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    return cleaned;
  };

  const handleExpiryChange = (e) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const handleCardAdded = async (e) => {
    e.preventDefault();

    if (!cardNumber || !expiry || !cvv) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const rawCard = cardNumber.replace(/\s/g, ''); // Убираем пробелы
    const rawData = rawCard + '|' + cvv;
    const encryptedCard = btoa(rawData);

    const payload = {
      userId: Number(localStorage.getItem('userId')),
      encryptedCard: encryptedCard,
      last4: rawCard.slice(-4),
      expirationDate: expiry
    };

    try {
      const res = await fetch(`http://localhost:8080/user/card/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Ошибка при сохранении карты');

      subscriptionParams === undefined
        ? navigate(-1)
        : navigate(`/client/parking/${id}/booking/subscription/confirmation/${subscriptionParams}`);
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении карты');
    }
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
            onChange={handleCardNumberChange}
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
              onChange={handleExpiryChange}
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
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
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
