import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import '../../css/adminDashboard.css';

const Chart2 = () => {
  const [data, setData] = useState([
    { role: 'Пользователи', count: 0 },
    { role: 'Владельцы', count: 0 }
  ]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/stats/user')
      .then(response => {
        if (!response.ok) throw new Error('Ошибка запроса');
        return response.json();
      })
      .then(({ users, owners }) => {
        setData([
          { role: 'Пользователи', count: users },
          { role: 'Владельцы', count: owners }
        ]);
      })
      .catch(error => {
        console.error('Ошибка при загрузке статистики пользователей:', error);
      });
  }, []);

  return (
    <div className="chart chart-container">
      <h3 className="chart-title">Распределение ролей</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="role" />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#FFD700"
            barSize={30}
            activeIndex={activeIndex}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            isAnimationActive={false} // Чтобы не было мигания
            opacity={1} // всегда полная непрозрачность
          >
            <LabelList dataKey="count" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart2;
