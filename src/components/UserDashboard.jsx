import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/clientProfile.css"; // Используем уже существующие стили

const UserDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const fallbackUser = { id: 0, email: "mockuser@mail.ru", role: "CLIENT" };
  const fallbackComplaints = [
    {
      id: 1,
      complainant: { email: "mock1@mail.ru" },
      accused: { email: fallbackUser.email },
      text: "Проблемы с общением.",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const userRes = await fetch(`http://localhost:8080/user/info/${id}`);
        setUser(userRes.ok ? await userRes.json() : fallbackUser);
      } catch {
        setUser(fallbackUser);
      }

      try {
        const complaintsRes = await fetch(`http://localhost:8080/user/complaints/${id}`);
        setComplaints(complaintsRes.ok ? await complaintsRes.json() : fallbackComplaints);
      } catch {
        setComplaints(fallbackComplaints);
      }
    };

    fetchData();
  }, [id]);

  const handleWriteMessage = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="client-profile" style={{gridTemplateColumns: "1fr"}}>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <div className="client-profile-header" style={{ textAlign: "center", marginBottom: "30px", justifyContent: "space-between" }}>
            <div className="avatar" />
            <div className="font-bold text-lg">{user?.email || "Загрузка..."}</div>
            <button className="btn-outline-yellow" onClick={handleWriteMessage} style={{ marginTop: "10px" }}>
              Написать сообщение
            </button>
          </div>

          <div className="section complaints">
            <h2 className="section-title" style={{ textAlign: "center" }}>Жалобы</h2>
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
              <a href="#" className="link-yellow" style={{ display: "block", textAlign: "center" }}>
                Все жалобы
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
