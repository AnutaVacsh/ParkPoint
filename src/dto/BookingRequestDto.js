export class BookingRequestDto {
    constructor(clientId, parkingSpaceId, startTime, endTime) {
      this.clientId = clientId;
      this.parkingSpaceId = parkingSpaceId;
      this.startTime = new Date(startTime);
      this.endTime = new Date(endTime);
    }
  }