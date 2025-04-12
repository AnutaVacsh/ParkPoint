export class ParkingZoneDto {
    constructor(id, title, address, description, map, parkingSpacesCount, photos) {
      this.id = id;
      this.title = title;
      this.address = address;
      this.description = description;
      this.map = map;
      this.parkingSpacesCount = parkingSpacesCount;
      this.photos = photos; // Массив объектов Photo
    }
  }
  