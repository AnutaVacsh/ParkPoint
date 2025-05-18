import { UserDto } from '../dto/UserDto';
import { userMockData } from '../dto/mock/UserMockData';

const BASE_URL = 'http://localhost:8080/auth';

// Функция для логина клиента
export const login = async (login, password) => {
  try {
    console.log(`Запрос на логин: login=${login}, password=${password}`);
    const response = await fetch(
      `${BASE_URL}/client/login?login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      if (response.status === 404 || response.status === 503) {
        console.warn('[MOCK] Сервер недоступен (404/503), возвращаем мок-данные');
        return userMockData;
      }
      throw new Error('Ошибка авторизации');
    }

    const user = await response.json();
    console.log('Ответ от сервера:', user);
    return new UserDto(user.id, user.email, user.role);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    return error;
  }
};

// Функция для регистрации клиента
export const register = async (registerRequest) => {
  try {
    console.log('Запрос на регистрацию клиента:', registerRequest);
    const response = await fetch(`${BASE_URL}/client/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerRequest),
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 503) {
        console.warn('[MOCK] Сервер недоступен (404/503), возвращаем мок-данные');
        return userMockData;
      }
      throw new Error('Ошибка регистрации клиента');
    }

    const result = await response.json();
    console.log('Ответ от сервера:', result);
    return new UserDto(result.id, result.email, result.role);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    console.warn('[MOCK] Ошибка соединения, возвращаем мок-данные');
    return userMockData;
  }
};

// Функция для регистрации владельца парковки
export const registerOwner = async (ownerRegisterRequest) => {
  try {
    console.log('Запрос на регистрацию владельца:', ownerRegisterRequest);
    const response = await fetch(`${BASE_URL}/owner/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ownerRegisterRequest),
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 503) {
        console.warn('[MOCK] Сервер недоступен (404/503), возвращаем мок-данные');
        return userMockData;
      }
      throw new Error(response.error);
    }

    const result = await response.json();
    console.log('Ответ от сервера:', result);
    return new UserDto(result.id, result.email, result.role);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};
