import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const { userId2 } = useParams();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  // Загрузка списка чатов
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:8080/chat/list/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        } else {
          console.error('Ошибка загрузки чатов');
        }
      } catch (error) {
        console.error('Ошибка сети при загрузке чатов:', error);
      }
    };

    fetchChats();
  }, [userId]);

  // При изменении userId2 или списка чатов — ищем чат и загружаем сообщения
  useEffect(() => {
    if (!userId2 || userId2 === '0') {
      setSelectedChatId(null);
      setMessages([]);
      return;
    }

    const otherUserId = parseInt(userId2);

    // Находим чат, если он уже есть
    const chatWithUser = chats.find(c =>
      c.owner?.id === otherUserId || c.client?.id === otherUserId
    );

    // Устанавливаем chatId, если найден
    if (chatWithUser) {
      setSelectedChatId(chatWithUser.id);
    } else {
      setSelectedChatId(null); // ещё не создан
    }

    // Загружаем сообщения в любом случае
    fetch(`http://localhost:8080/chat/getMes/${userId}/${otherUserId}`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки сообщений');
        return res.json();
      })
      .then(data => {
        // Отсортируем сообщения по времени (от старого к новому)
        const sortedMessages = data.slice().sort((a, b) => new Date(a.time) - new Date(b.time));
        setMessages(sortedMessages);
      })

      .catch(e => {
        console.error(e);
        setMessages([]);
      });

  }, [userId2, userId, chats]);


  const handleChatClick = (otherUserId) => {
    navigate(`/chat/${otherUserId}`);
  };

  const sendMessage = async () => {
  if (!messageText.trim() || !selectedChatId) return;

  const chat = chats.find(c => c.id === selectedChatId);
  if (!chat) return;

  const recipientUserId = role === "OWNER" ? chat.client?.id : chat.owner?.id;
  if (!recipientUserId) return;

  const messageDto = {
    id: null,
    chatId: selectedChatId,
    sender: parseInt(userId),
    recipient: recipientUserId,
    content: messageText,
    time: new Date().toISOString(),
    status: "SENT"
  };

  try {
    const response = await fetch('http://localhost:8080/chat/create/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageDto),
    });

    if (response.ok) {
      const savedMessage = await response.json();
      setMessages(prev => [...prev, savedMessage]);
      setMessageText('');
    } else {
      console.error('Не удалось отправить сообщение');
    }
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
  }
};

  // Выбранный чат для отображения данных (имя собеседника и т.п.)
  const selectedChat = chats.find(c => c.id === selectedChatId);

  // Определяем имя собеседника для заголовка
  const chatPartnerName = (() => {
    if (!selectedChat) return '';
    if (role === 'OWNER' || role === "ADMIN") return selectedChat.client?.username || selectedChat.client?.email || 'Неизвестный пользователь';
    return selectedChat.owner?.username || selectedChat.owner?.email || 'Неизвестный пользователь';
  })();

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2>Чаты</h2>
        {chats.map(chat => {
          const otherUser = role === "OWNER" || role === "ADMIN" ? chat.client : chat.owner;
          return (
            <div
              key={chat.id}
              style={{
                ...styles.chatItem,
                backgroundColor: selectedChatId === chat.id ? '#2C323A' : 'transparent',
                color: selectedChatId === chat.id ? '#FFD700' : '#fff',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onClick={() => handleChatClick(otherUser?.id)}
            >
              {otherUser?.email || 'Неизвестный пользователь'}
            </div>
          );
        })}
      </div>

      <div style={styles.chatWindow}>
        {selectedChat ? (
          <>
            <div style={styles.chatHeader}>
              Чат с {chatPartnerName}
            </div>

            <div style={styles.messagesContainer}>
              {messages.length > 0 ? (
                messages.map(msg => {
                  const isCurrentUserSender = msg.sender?.id === parseInt(userId);
                  return (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.message,
                        alignSelf: isCurrentUserSender ? 'flex-end' : 'flex-start',
                        backgroundColor: isCurrentUserSender ? '#FFD700' : '#333',
                        color: isCurrentUserSender ? '#000' : '#fff',
                      }}
                    >
                      <div>{msg.content}</div>
                      <div style={styles.messageTime}>
                        {new Date(msg.time).toLocaleString()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: '#aaa', fontStyle: 'italic' }}>Сообщений пока нет</div>
              )}
            </div>

            <div style={styles.inputContainer}>
              <input
                style={styles.input}
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Введите сообщение..."
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              />
              <button style={styles.sendButton} onClick={sendMessage}>Отправить</button>
            </div>
          </>
        ) : (
          <div style={styles.noChatMessage}>Выберите чат из списка слева</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '100px',
    display: 'flex',
    height: 'calc(100vh - 100px)',
    backgroundColor: '#1D2329',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '25%',
    borderRight: '1px solid #444',
    padding: '16px',
    overflowY: 'auto',
    backgroundColor: '#2C323A',
  },
  chatItem: {
    padding: '10px',
    marginBottom: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  chatWindow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: '#222',
  },
  chatHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    borderBottom: '1px solid #444',
    paddingBottom: '8px',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '8px',
    marginBottom: '16px',
  },
  message: {
    padding: '10px',
    borderRadius: '8px',
    maxWidth: '60%',
  },
  messageTime: {
    fontSize: '10px',
    marginTop: '4px',
    opacity: 0.6,
    textAlign: 'right',
  },
  inputContainer: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#2C323A',
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#FFD700',
    border: 'none',
    color: '#000',
    fontWeight: 'bold',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  noChatMessage: {
    color: '#aaa',
    marginTop: '40px',
  },
};

export default ChatPage;
