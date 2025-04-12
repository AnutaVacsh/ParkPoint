export class SubscriptionRequestDto {
    constructor(parkingSpaceId, clientId, dayOfWeek, startTime, endTime) {
      this.parkingSpaceId = parkingSpaceId;
      this.clientId = clientId;
      this.dayOfWeek = dayOfWeek;
      this.startTime = startTime;
      this.endTime = endTime;
    }
  }
  