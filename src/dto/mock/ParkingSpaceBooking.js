export const mockParkingSpaceBooking = [
    {
      parkingSpaceDto: {
        id: 1,
        idOwner: 101,
        order: 1,
        hourlyPrice: 100,
        dailyPrice: 500,
        weeklyPrice: 3000,
        monthlyPrice: 10000,
        isAvailable: true,
        description: 'Парковка рядом с входом',
        parkingZoneDto: {
          name: 'Зона 1',
          location: 'Первый этаж'
        }
      },
      timeSlots: [
        { startTime: new Date('2025-04-27T09:00:00'), endTime: new Date('2025-04-27T10:00:00') },
        { startTime: new Date('2025-04-27T10:00:00'), endTime: new Date('2025-04-27T11:00:00') },
        { startTime: new Date('2025-04-27T11:00:00'), endTime: new Date('2025-04-27T12:00:00') },
        { startTime: new Date('2025-04-27T12:00:00'), endTime: new Date('2025-04-27T13:00:00') },
        { startTime: new Date('2025-04-27T13:00:00'), endTime: new Date('2025-04-27T14:00:00') }
      ]
    },
    {
      parkingSpaceDto: {
        id: 2,
        idOwner: 102,
        order: 2,
        hourlyPrice: 150,
        dailyPrice: 700,
        weeklyPrice: 4000,
        monthlyPrice: 12000,
        isAvailable: false,
        description: 'Парковка с кондиционером',
        parkingZoneDto: {
          name: 'Зона 2',
          location: 'Второй этаж'
        }
      },
      timeSlots: [
        { startTime: new Date('2025-04-27T09:00:00'), endTime: new Date('2025-04-27T10:00:00') },
        { startTime: new Date('2025-04-27T10:00:00'), endTime: new Date('2025-04-27T11:00:00') },
        { startTime: new Date('2025-04-27T11:00:00'), endTime: new Date('2025-04-27T12:00:00') },
        { startTime: new Date('2025-04-27T12:00:00'), endTime: new Date('2025-04-27T13:00:00') },
        { startTime: new Date('2025-04-27T13:00:00'), endTime: new Date('2025-04-27T14:00:00') }
      ]
    }
  ];