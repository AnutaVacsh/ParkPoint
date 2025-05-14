import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const { chatId } = useParams(); // Получаем id чата из URL
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();

  console.log(chatId)

 // Моки для чатов и сообщений
  const mockChats = [
    { id: '1', client: { username: 'b' }, messages: [] },
    { id: '2', client: { username: 'owner@mail.ru' }, messages: [] },
    // { id: '3', client: { username: 'User 3' }, messages: [] },
  ];

  const mockChat = {
    id: '2',
    owner: { id: '123', username: 'Owner' },
    client: { id: '1', username: 'owner@mail.ru' },
    messages: [
      { id: '1', content: 'Привет!', sender: { id: '123', username: 'Owner' }, time: '2025-05-12T10:00:00Z' },
      { id: '2', content: 'Привет, как дела?', sender: { id: '1', username: 'User 1' }, time: '2025-05-12T10:05:00Z' },
    ],
  };

  // Замокаем загрузку чатов
  useEffect(() => {
    setChats(mockChats);
  }, []);

  // Замокаем загрузку выбранного чата, если chatId не 0
  useEffect(() => {
    if (chatId === '0') {
      setSelectedChat(null); // Если chatId 0, значит чат не выбран
      return;
    }

    if (chatId) {
      setSelectedChat(mockChat); // Замокаем данные для выбранного чата
    }
  }, [chatId]);

  const handleChatClick = (id) => {
    setSelectedChat(mockChat)
    navigate(`/chat/${id}`); // Переход на страницу выбранного чата
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      content: messageText,
      time: new Date().toISOString(),
      sender: selectedChat.owner,
      recipient: selectedChat.client,
    };

    // Имитация отправки сообщения
    fetch(`/api/chats/${selectedChat.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: messageText }),
    });

    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    });

    setMessageText('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2>Чаты</h2>
        {chats.map(chat => (
            <div
                key={chat.id}
                style={{
                ...styles.chatItem,
                backgroundColor: selectedChat?.id === chat.id ? '#2C323A' : 'transparent',
                color: selectedChat?.id === chat.id ? '#FFD700' : '#fff', // Цвет текста для выбранного чата
                transition: 'background-color 0.3s ease, color 0.3s ease', // Плавный переход для фона и текста
                }}
                onClick={() => handleChatClick(chat.id)}
            >
                {chat.client.username}
            </div>
            ))}
      </div>

      <div style={styles.chatWindow}>
        {selectedChat ? (
          <>
            <div style={styles.chatHeader}>
              Чат с {selectedChat.client.username}
            </div>

            <div style={styles.messagesContainer}>
              {selectedChat.messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.message,
                    alignSelf: msg.sender.id === selectedChat.owner.id ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender.id === selectedChat.owner.id ? '#FFD700' : '#333',
                    color: msg.sender.id === selectedChat.owner.id ? '#000' : '#fff',
                  }}
                >
                  <div>{msg.content}</div>
                  <div style={styles.messageTime}>{new Date(msg.time).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div style={styles.inputContainer}>
              <input
                style={styles.input}
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Введите сообщение..."
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
