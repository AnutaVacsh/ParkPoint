export class SubscriptionResponseDto {
    constructor(parkingSpace, dayOfWeek, startTime, endTime) {
      this.parkingSpace = parkingSpace;
      this.dayOfWeek = dayOfWeek; // Массив с днями недели [0-6]
      this.startTime = startTime;
      this.endTime = endTime;
    }
  }