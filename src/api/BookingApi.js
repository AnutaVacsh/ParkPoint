import { mockBookingResponse, mockBookingResponseList, mockSubscriptionResponse } from "../dto/mock/BookingMock";

const BASE_URL = 'http://localhost:8080';  // Замените на актуальный URL вашего API

// Получить информацию о бронировании по ID
export const getBookingInfo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/booking/get/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении информации о бронировании');
    }

    const data = await response.json();
    return data;  // Возвращаем реальные данные
  } catch (error) {
    console.error('Ошибка:', error);
    // Возвращаем моковые данные при ошибке
    return mockBookingResponse.parkingSpaces.flatMap(parkingSpace => 
      parkingSpace.bookings.filter(booking => booking.parkingSpace.id === id)  // Фильтруем бронирования по id парковочного места
    );
  }
};

// Получить бронирование пользователя по userId
export const getUserBooking = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/booking/get/booking/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении бронирования пользователя');
    }

    const data = await response.json();
    return data;  // Возвращаем реальные данные
  } catch (error) {
    console.error('Ошибка:', error);
    // Возвращаем моковые данные при ошибке
    return mockBookingResponse.parkingSpaces.flatMap(parkingSpace => 
      parkingSpace.bookings.filter(booking => booking.client.id === userId)  // Фильтруем бронирования по userId
    );
  }
};

// Получить информацию о подписке по ID парковочного места
export const getSubscriptionInfo = async (idParkingSpace) => {
  try {
    const response = await fetch(`${BASE_URL}/booking/subscription/${idParkingSpace}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении информации о подписке');
    }

    const data = await response.json();
    return data;  // Возвращаем реальные данные
  } catch (error) {
    console.error('Ошибка:', error);
    // Возвращаем моковые данные при ошибке
    return mockSubscriptionResponse;
  }
};

// Получить подписки пользователя по userId
export const getUserSubscriptions = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/booking/subscriptions/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении подписок пользователя');
    }

    const data = await response.json();
    return data;  // Возвращаем реальные данные
  } catch (error) {
    console.error('Ошибка:', error);
    // Возвращаем моковые данные при ошибке
    return [mockSubscriptionResponse];
  }
};

export const getBookingsWithPagination = async (searchRequestDTO) => {
    try {
      console.log('[API] Отправка запроса на получение бронирований с пагинацией...');
      console.log('[API] Тело запроса:', searchRequestDTO);
  
      const response = await fetch(`${BASE_URL}/booking/${localStorage.getItem("userId")}/getAllWithPag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequestDTO),
      });
  
      console.log('[API] Статус ответа:', response.status);
  
      if (!response.ok) {
        throw new Error('Ошибка при получении бронирований с пагинацией');
      }
  
      const data = await response.json();
      console.log('[API] Данные успешно получены:', data);
  
      return data;
    } catch (error) {
      console.debug('[API] Ошибка при получении бронирований с пагинацией:', error);
      console.log("mack: ", mockBookingResponseList)
      return mockBookingResponseList;
    }
  };
  
  