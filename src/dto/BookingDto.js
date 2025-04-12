export class BookingDto {
    constructor(id, parkingSpace, startTime, endTime, dateCreated, status) {
      this.id = id;
      this.parkingSpace = parkingSpace; // Объект ParkingSpaceDto
      this.startTime = new Date(startTime);
      this.endTime = new Date(endTime);
      this.dateCreated = new Date(dateCreated);
      this.status = status; // Статус бронирования (StateBooking)
    }
  }
  