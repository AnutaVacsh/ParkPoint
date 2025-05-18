// TakePart.jsx
import React, { useState } from 'react';
import '../css/takePart.css';
import { Link } from 'react-router-dom';

const TakePart = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  return (
    <div className="takepart-container">
      <div className="takepart-background">
        <div className="takepart-overlay">
          <h1 className="takepart-title">Аренда парковочных мест</h1>
          <p className="takepart-paragraph">
            Сервис аренды «ParkPoint» — ваш цифровой помощник для быстрого и удобного
            управления парковочными местами в жилых комплексах и бизнес-центрах. Мы создаем
            единое пространство, где владельцы парковочных мест и арендаторы могут легко находить
            друг друга и сотрудничать.
          </p>
          <p className="takepart-paragraph">
            Полная автоматизация, гибкие условия. Для запуска системы не требуется дорогостоящего
            оборудования или дополнительных сотрудников. Всё, что вам нужно, — это доступ к нашему
            веб-приложению, где вы сможете эффективно управлять своим парковочным пространством,
            следить за занятостью мест и получать доход без лишних усилий.
          </p>

          <h2 className="takepart-subtitle">Как начать сдавать парковку через ParkPoint?</h2>

          <div className="takepart-steps">
            <div className="step">
              <div className="step-circle">1</div>
              <div className="step-text">
                <strong>Заявка</strong> — Оставьте заявку на сайте
              </div>
            </div>
            <div className="step-line" />
            <div className="step">
              <div className="step-circle">2</div>
              <div className="step-text">
                <strong>Одобрение</strong> — После проверки и согласования технического решения администратор одобрит подключение сервиса для вашей парковки.
              </div>
            </div>
            <div className="step-line" />
            <div className="step">
              <div className="step-circle">3</div>
              <div className="step-text">
                <strong>Использование</strong> — После одобрения вы сможете начать сдавать ваше парковочное место через платформу.
              </div>
            </div>
          </div>
        </div>
        <Link to="/sendApplication" className="takepart-button">
            Хочу принять участие
        </Link>

      </div>
    </div>
  );
};

export default TakePart;
