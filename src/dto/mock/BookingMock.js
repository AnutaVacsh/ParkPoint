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

  export const parkingSubscriptionsMock = {
    "content": [
      {
        "id": 5,
        "client": {
          "id": 13,
          "email": "anya@example.com",
          "role": "CLIENT"
        },
        "parkingSpace": {
          "id": 36,
          "idOwner": null,
          "order": 1,
          "hourlyPrice": 6000,
          "dailyPrice": 36000,
          "weeklyPrice": 125000,
          "monthlyPrice": 420000,
          "isAvailable": "ACTIVE",
          "description": "Центральное место",
          "parkingZoneDto": {
            "id": 10,
            "zoneManager": 23,
            "title": "Парковка у Цирка",
            "address": "г. Саратов, ул. Чапаева, 61",
            "description": "Парковка цирка им. Никулина",
            "map": "https://maps.yandex.ru/?text=51.5258,46.0317",
            "state": "ACTIVE",
            "parkingSpacesCount": 3,
            "latitude": 51.5258,
            "longitude": 46.0317,
            "photos": []
          }
        },
        "startTime": "2025-07-03T04:00:00",
        "endTime": "2025-08-13T09:00:00",
        "dateCreated": "2025-05-03T15:31:44.619335",
        "status": "SUBSCRIPTION",
        "price": 420000
      },
      {
        "id": 1,
        "client": {
          "id": 13,
          "email": "anya@example.com",
          "role": "CLIENT"
        },
        "parkingSpace": {
          "id": 2,
          "idOwner": null,
          "order": 2,
          "hourlyPrice": 5000,
          "dailyPrice": 30000,
          "weeklyPrice": 100000,
          "monthlyPrice": 350000,
          "isAvailable": "ACTIVE",
          "description": "Место у столба",
          "parkingZoneDto": {
            "id": 1,
            "zoneManager": 14,
            "title": "Парковка ТЦ \"Победа Плаза\"",
            "address": "г. Саратов, ул. Орджоникидзе, 1",
            "description": "Крытая парковка торгового центра",
            "map": "https://maps.yandex.ru/?text=51.5334,46.0342",
            "state": "ACTIVE",
            "parkingSpacesCount": 5,
            "latitude": 51.5334,
            "longitude": 46.0342,
            "photos": []
          }
        },
        "startTime": "2025-05-17T00:08:00",
        "endTime": "2025-05-17T01:23:00",
        "dateCreated": "2025-05-03T14:28:38.581456",
        "status": "CONFIRMED",
        "price": 5000
      },
      {
        "id": 7,
        "client": {
          "id": 13,
          "email": "anya@example.com",
          "role": "CLIENT"
        },
        "parkingSpace": {
          "id": 36,
          "idOwner": null,
          "order": 1,
          "hourlyPrice": 6000,
          "dailyPrice": 36000,
          "weeklyPrice": 125000,
          "monthlyPrice": 420000,
          "isAvailable": "ACTIVE",
          "description": "Центральное место",
          "parkingZoneDto": {
            "id": 10,
            "zoneManager": 23,
            "title": "Парковка у Цирка",
            "address": "г. Саратов, ул. Чапаева, 61",
            "description": "Парковка цирка им. Никулина",
            "map": "https://maps.yandex.ru/?text=51.5258,46.0317",
            "state": "ACTIVE",
            "parkingSpacesCount": 3,
            "latitude": 51.5258,
            "longitude": 46.0317,
            "photos": []
          }
        },
        "startTime": "2025-05-05T07:00:00",
        "endTime": "2025-05-05T18:00:00",
        "dateCreated": "2025-05-03T18:31:53.03676",
        "status": "COMPLETED",
        "price": 36000
      },
      {
        "id": 8,
        "client": {
          "id": 13,
          "email": "anya@example.com",
          "role": "CLIENT"
        },
        "parkingSpace": {
          "id": 37,
          "idOwner": null,
          "order": 2,
          "hourlyPrice": 6000,
          "dailyPrice": 36000,
          "weeklyPrice": 125000,
          "monthlyPrice": 420000,
          "isAvailable": "ACTIVE",
          "description": "Занято",
          "parkingZoneDto": {
            "id": 10,
            "zoneManager": 23,
            "title": "Парковка у Цирка",
            "address": "г. Саратов, ул. Чапаева, 61",
            "description": "Парковка цирка им. Никулина",
            "map": "https://maps.yandex.ru/?text=51.5258,46.0317",
            "state": "ACTIVE",
            "parkingSpacesCount": 3,
            "latitude": 51.5258,
            "longitude": 46.0317,
            "photos": []
          }
        },
        "startTime": "2025-05-05T01:55:00",
        "endTime": "2025-05-05T04:25:00",
        "dateCreated": "2025-05-03T18:39:27.905886",
        "status": "CANCELLED",
        "price": 15000
      },
      {
        "id": 6,
        "client": {
          "id": 13,
          "email": "anya@example.com",
          "role": "CLIENT"
        },
        "parkingSpace": {
          "id": 36,
          "idOwner": null,
          "order": 1,
          "hourlyPrice": 6000,
          "dailyPrice": 36000,
          "weeklyPrice": 125000,
          "monthlyPrice": 420000,
          "isAvailable": "ACTIVE",
          "description": "Центральное место",
          "parkingZoneDto": {
            "id": 10,
            "zoneManager": 23,
            "title": "Парковка у Цирка",
            "address": "г. Саратов, ул. Чапаева, 61",
            "description": "Парковка цирка им. Никулина",
            "map": "https://maps.yandex.ru/?text=51.5258,46.0317",
            "state": "ACTIVE",
            "parkingSpacesCount": 3,
            "latitude": 51.5258,
            "longitude": 46.0317,
            "photos": []
          }
        },
        "startTime": "2025-05-04T08:21:00",
        "endTime": "2025-05-04T13:00:00",
        "dateCreated": "2025-05-03T15:47:21.045385",
        "status": "EXPIRED",
        "price": 36000
      },
      {
        "id": 4,
        "client": {
          "id": 13,
          "email": "anya@example.com",
          "role": "CLIENT"
        },
        "parkingSpace": {
          "id": 36,
          "idOwner": null,
          "order": 1,
          "hourlyPrice": 6000,
          "dailyPrice": 36000,
          "weeklyPrice": 125000,
          "monthlyPrice": 420000,
          "isAvailable": "ACTIVE",
          "description": "Центральное место",
          "parkingZoneDto": {
            "id": 10,
            "zoneManager": 23,
            "title": "Парковка у Цирка",
            "address": "г. Саратов, ул. Чапаева, 61",
            "description": "Парковка цирка им. Никулина",
            "map": "https://maps.yandex.ru/?text=51.5258,46.0317",
            "state": "ACTIVE",
            "parkingSpacesCount": 3,
            "latitude": 51.5258,
            "longitude": 46.0317,
            "photos": []
          }
        },
        "startTime": "2025-05-04T00:17:00",
        "endTime": "2025-05-04T05:28:00",
        "dateCreated": "2025-05-03T15:25:33.253986",
        "status": "REJECTED",
        "price": null
      },
      {
        "id": 3,
        "client": {
          "id": 13,
          "email": "anya@example.com",
          "role": "CLIENT"
        },
        "parkingSpace": {
          "id": 37,
          "idOwner": null,
          "order": 2,
          "hourlyPrice": 6000,
          "dailyPrice": 36000,
          "weeklyPrice": 125000,
          "monthlyPrice": 420000,
          "isAvailable": "ACTIVE",
          "description": "Занято",
          "parkingZoneDto": {
            "id": 10,
            "zoneManager": 23,
            "title": "Парковка у Цирка",
            "address": "г. Саратов, ул. Чапаева, 61",
            "description": "Парковка цирка им. Никулина",
            "map": "https://maps.yandex.ru/?text=51.5258,46.0317",
            "state": "ACTIVE",
            "parkingSpacesCount": 3,
            "latitude": 51.5258,
            "longitude": 46.0317,
            "photos": []
          }
        },
        "startTime": "2025-05-04T00:12:00",
        "endTime": "2025-05-04T04:18:00",
        "dateCreated": "2025-05-03T15:24:26.697493",
        "status": "PENDING",
        "price": null
      },
      {
        "id": 2,
        "client": {
          "id": 13,
          "email": "anya@example.com",
          "role": "CLIENT"
        },
        "parkingSpace": {
          "id": 38,
          "idOwner": null,
          "order": 3,
          "hourlyPrice": 7000,
          "dailyPrice": 42000,
          "weeklyPrice": 145000,
          "monthlyPrice": 490000,
          "isAvailable": "ACTIVE",
          "description": "Место у входа",
          "parkingZoneDto": {
            "id": 10,
            "zoneManager": 23,
            "title": "Парковка у Цирка",
            "address": "г. Саратов, ул. Чапаева, 61",
            "description": "Парковка цирка им. Никулина",
            "map": "https://maps.yandex.ru/?text=51.5258,46.0317",
            "state": "ACTIVE",
            "parkingSpacesCount": 3,
            "latitude": 51.5258,
            "longitude": 46.0317,
            "photos": []
          }
        },
        "startTime": "2025-05-03T03:44:00",
        "endTime": "2025-05-03T07:48:00",
        "dateCreated": "2025-05-03T15:01:22.363618",
        "status": "PENDING",
        "price": null
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20,
      "sort": [
        {
          "direction": "DESC",
          "property": "startTime",
          "ignoreCase": false,
          "nullHandling": "NATIVE",
          "ascending": false,
          "descending": true
        }
      ],
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 8,
    "totalPages": 1,
    "size": 20,
    "number": 0,
    "sort": [
      {
        "direction": "DESC",
        "property": "startTime",
        "ignoreCase": false,
        "nullHandling": "NATIVE",
        "ascending": false,
        "descending": true
      }
    ],
    "numberOfElements": 8,
    "first": true,
    "empty": false
  };
