export class ParkingSpaceDto {
    constructor(id, idOwner, order, price, isAvailable, parkingZoneDto, bookings) {
      this.id = id;
      this.idOwner = idOwner;
      this.order = order;
      this.price = price;
      this.isAvailable = isAvailable;
      this.parkingZoneDto = parkingZoneDto;
    }
  }
  