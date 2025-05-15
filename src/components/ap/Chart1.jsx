import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import '../../css/adminDashboard.css';

const Chart1 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/stats/booking')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        return response.json();
      })
      .then(data => {
        const formatted = data.map(item => ({
          date: new Date(item.date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
          }),
          sent: item.sent,
          confirmed: item.confirmed
        }));
        setData(formatted);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных бронирований:', error);
      });
  }, []);

  return (
    <div className="chart chart-container">
      <h3 className="chart-title">Количество бронирований по дням</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="sent"
            name="Отправленные заявки"
            stroke="#FFD700"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="confirmed"
            name="Подтверждённые"
            stroke="#58ff00"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart1;
