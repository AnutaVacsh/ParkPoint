import { UserDto } from '../dto/UserDto';
import { userMockData } from '../dto/mock/UserMockData';

const BASE_URL = 'http://localhost:8080/auth';

// Функция для проверки доступности сервера
const isServerAvailable = async () => {
  try {
    const res = await fetch(`${BASE_URL}/ping`, { method: 'GET' }); // Endpoint ping для проверки доступности
    return res.ok;
  } catch (error) {
    console.error('Сервер недоступен:', error);
    return false;
  }
};

// Функция для логина
export const login = async (login, password) => {
  const serverAvailable = await isServerAvailable();

  if (!serverAvailable) {
    console.warn('[MOCK] Сервер недоступен, возвращаем мок-данные');
    return userMockData;
  }

  try {
    console.log(`Запрос на логин: login=${login}, password=${password}`);
    const response = await fetch(
      `${BASE_URL}/client/login?login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error('Ошибка авторизации');
    }

    const user = await response.json();
    console.log('Ответ от сервера:', user);
    return new UserDto(user.email, user.role);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};

// Функция для регистрации клиента
export const register = async (registerRequest) => {
  const serverAvailable = await isServerAvailable();

  if (!serverAvailable) {
    console.warn('[MOCK] Сервер недоступен, возвращаем мок-данные');
    return userMockData;
  }

  try {
    console.log('Запрос на регистрацию:', registerRequest);
    const response = await fetch(`${BASE_URL}/client/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerRequest),
    });

    if (!response.ok) {
      throw new Error('Ошибка регистрации');
    }

    const result = await response.text();
    console.log('Ответ от сервера:', result);
    return result;
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};
