import { BookingDto } from "../BookingDto";
import { BookingResponseDto } from "../BookingResponseDto";
import { StateBooking } from "../enam/StateBooking";
import { ParkingSpaceDto } from "../ParkingSpaceDto";
import { ParkingZoneDto } from "../ParkingZoneDto";
import { Photo } from "../Photo";
import { SubscriptionRequestDto } from "../SubscriptionRequestDto";
import { SubscriptionResponseDto } from "../SubscriptionResponseDto";

// Моки для объектов

// ParkingZoneDto
export const mockParkingZone = new ParkingZoneDto(
    1,
    'Зона 1',
    'ул. Пушкина, д. 10',
    'Описание зоны парковки',
    'map_url',
    10,
    []
  );
  
  // Photo
  export const mockPhoto = new Photo(
    1,
    mockParkingZone,
    1,
    'photo_url'
  );
  
  // BookingDto 1
  export const mockBooking1 = new BookingDto(
    1,
    null, // назначено позже
    '2025-04-12T10:00:00',
    '2025-04-12T12:00:00',
    '2025-04-01T10:00:00',
    StateBooking.PENDING
  );
  
  // BookingDto 2
  export const mockBooking2 = new BookingDto(
    2,
    null, // назначено позже
    '2025-04-13T10:00:00',
    '2025-04-13T12:00:00',
    '2025-04-02T10:00:00',
    StateBooking.CONFIRMED
  );
  
  // ParkingSpaceDto (без массива бронирований)
  export const mockParkingSpace = new ParkingSpaceDto(
    101,
    1,
    1,
    100,
    true,
    mockParkingZone
  );
  
  // Присваиваем парковку для бронирований
  mockBooking1.parkingSpace = mockParkingSpace;
  mockBooking2.parkingSpace = mockParkingSpace;
  
  // BookingResponseDto
  export const mockBookingResponse = new BookingResponseDto([mockParkingSpace]);
  
  export const mockSubscriptionRequest = new SubscriptionRequestDto(
    mockParkingSpace.id,
    1,
    [1, 3, 5],
    '08:00',
    '10:00'
  );
  
  export const mockSubscriptionResponse = new SubscriptionResponseDto(
    mockParkingSpace,
    [1, 3, 5],
    '08:00',
    '10:00'
  );
  
  export const mockBookingResponseList = [
    {
      id: 1,
      client: { id: 1, name: 'Иван Иванов' },
      parkingSpace: {
        id: 101,
        idOwner: 1,
        order: 1,
        price: 100,
        isAvailable: true,
        parkingZoneDto: {
          id: 1,
          title: 'Центральная парковка',
          address: 'ул. Пушкина, д. 1',
          description: 'Парковка рядом с торговым центром.',
          map: 'map_link',
          parkingSpacesCount: 50,
          photos: ['photo1.jpg', 'photo2.jpg']
        }
      },
      startTime: '2025-04-12T10:00:00',
      endTime: '2025-04-12T12:00:00',
      dateCreated: '2025-04-01T09:00:00',
      status: 'PENDING',
    },
    {
      id: 2,
      client: { id: 2, name: 'Мария Петрова' },
      parkingSpace: {
        id: 102,
        idOwner: 2,
        order: 2,
        price: 150,
        isAvailable: false,
        parkingZoneDto: {
          id: 2,
          title: 'Парковка у метро',
          address: 'ул. Ленина, д. 2',
          description: 'Парковка рядом с метро.',
          map: 'map_link_2',
          parkingSpacesCount: 30,
          photos: ['photo3.jpg', 'photo4.jpg']
        }
      },
      startTime: '2025-04-13T10:00:00',
      endTime: '2025-04-13T12:00:00',
      dateCreated: '2025-04-02T09:00:00',
      status: 'CONFIRMED',
    },
  ];