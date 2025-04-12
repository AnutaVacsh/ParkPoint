export class Photo {
    constructor(id, parkingZone, order, photoUrl) {
      this.id = id;
      this.parkingZone = parkingZone; // Объект ParkingZoneDto
      this.order = order;
      this.photoUrl = photoUrl;
    }
  }
  