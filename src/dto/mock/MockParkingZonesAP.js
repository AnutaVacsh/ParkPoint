// src/dto/mock/MockParkingZonesAP.js

export const mockParkingZonesAP = [
    {
        id: 1,
        zoneManager: {
            id: 101,
            email: "manager1@example.com",
            role: "ADMIN" // Assuming Role is a string enum in your frontend
        },
        title: "Downtown Parking",
        address: "123 Main St, Cityville",
        description: "Secure parking in downtown area",
        map: "https://maps.example.com/downtown",
        state: "ACTIVE",
        parkingSpacesCount: 50,
        latitude: 34.052235,
        longitude: -118.243683,
        photos: [
            { id: 1, url: "https://example.com/photo1.jpg" },
            { id: 2, url: "https://example.com/photo2.jpg" }
        ]
    },
    {
        id: 2,
        zoneManager: {
            id: 102,
            email: "manager2@example.com",
            role: "ZONE_MANAGER"
        },
        title: "Mall Parking",
        address: "456 Shopping Ave, Townsville",
        description: "Parking near the main mall entrance",
        map: "https://maps.example.com/mall",
        state: "ACTIVE",
        parkingSpacesCount: 120,
        latitude: 34.062235,
        longitude: -118.253683,
        photos: [
            { id: 3, url: "https://example.com/photo3.jpg" }
        ]
    },
    {
        id: 3,
        zoneManager: {
            id: 103,
            email: "manager3@example.com",
            role: "ZONE_MANAGER"
        },
        title: "Pending Approval Zone",
        address: "789 New St, Villagetown",
        description: "New parking zone awaiting approval",
        map: "https://maps.example.com/newzone",
        state: "PENDING",
        parkingSpacesCount: 30,
        latitude: 34.072235,
        longitude: -118.263683,
        photos: []
    }
];

// You might also want to export related enums if needed in your frontend
export const StateParkingZone = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    PENDING: "PENDING"
};

export const Role = {
    ADMIN: "ADMIN",
    ZONE_MANAGER: "ZONE_MANAGER",
    USER: "USER"
};