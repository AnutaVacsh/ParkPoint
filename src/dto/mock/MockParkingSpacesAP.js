// mockParkingSpaces.js


const mockParkingSpacesAP = 
    [
      {
        id: 1,
        owner: {
        id: 101,
        email: "owner1@example.com",
        role: "USER"
        },
        order: 1,
        hourlyPrice: 50,
        dailyPrice: 500,
        weeklyPrice: 2500,
        monthlyPrice: 9000,
        isAvailable: "ACTIVE",
        description: "Центральная парковка, место №1",
        parkingZoneDto: {
        id: 1001,
        title: "Центральная зона",
        address: "ул. Центральная, 1"
        }
    },
    {
        id: 2,
        owner: {
        id: 102,
        email: "owner2@example.com",
        role: "ADMIN"
        },
        order: 2,
        hourlyPrice: 60,
        dailyPrice: 550,
        weeklyPrice: 2600,
        monthlyPrice: 9500,
        isAvailable: "ACTIVE",
        description: "Центральная парковка, место №2",
        parkingZoneDto: {
        id: 1001,
        title: "Центральная зона",
        address: "ул. Центральная, 1"
        }
    },
    {
        id: 3,
        owner: {
        id: 103,
        email: "owner3@example.com",
        role: "USER"
        },
        order: 3,
        hourlyPrice: 40,
        dailyPrice: 400,
        weeklyPrice: 2000,
        monthlyPrice: 7500,
        isAvailable: "PENDING",
        description: "Северная парковка, место №1",
        parkingZoneDto: {
        id: 1002,
        title: "Северная зона",
        address: "ул. Северная, 5"
        }
    },
    {
        id: 4,
        owner: {
        id: 104,
        email: "owner4@example.com",
        role: "USER"
        },
        order: 4,
        hourlyPrice: 55,
        dailyPrice: 520,
        weeklyPrice: 2400,
        monthlyPrice: 8500,
        isAvailable: "INACTIVE",
        description: "Южная парковка, место №1",
        parkingZoneDto: {
        id: 1003,
        title: "Южная зона",
        address: "ул. Южная, 10"
        }
    },
    {
        id: 5,
        owner: {
        id: 105,
        email: "owner5@example.com",
        role: "USER"
        },
        order: 5,
        hourlyPrice: 70,
        dailyPrice: 600,
        weeklyPrice: 2800,
        monthlyPrice: 10000,
        isAvailable: "ACTIVE",
        description: "VIP парковка, место №1",
        parkingZoneDto: {
        id: 1004,
        title: "VIP зона",
        address: "ул. Центральная, 2"
        }
    },
    {
        id: 6,
        owner: {
        id: 106,
        email: "owner6@example.com",
        role: "USER"
        },
        order: 6,
        hourlyPrice: 30,
        dailyPrice: 300,
        weeklyPrice: 1500,
        monthlyPrice: 5000,
        isAvailable: "REJECTED",
        description: "Эконом парковка, место №1",
        parkingZoneDto: {
        id: 1005,
        title: "Эконом зона",
        address: "ул. Западная, 3"
        }
    },
    {
        id: 7,
        owner: {
        id: 107,
        email: "owner7@example.com",
        role: "USER"
        },
        order: 7,
        hourlyPrice: 45,
        dailyPrice: 450,
        weeklyPrice: 2200,
        monthlyPrice: 8000,
        isAvailable: "BAN",
        description: "Восточная парковка, место №1",
        parkingZoneDto: {
        id: 1006,
        title: "Восточная зона",
        address: "ул. Восточная, 7"
        }
    },
    {
        id: 8,
        owner: {
        id: 108,
        email: "owner8@example.com",
        role: "ADMIN"
        },
        order: 8,
        hourlyPrice: 65,
        dailyPrice: 580,
        weeklyPrice: 2700,
        monthlyPrice: 9800,
        isAvailable: "ACTIVE",
        description: "Бизнес парковка, место №1",
        parkingZoneDto: {
        id: 1007,
        title: "Бизнес зона",
        address: "ул. Центральная, 3"
        }
    },
    {
        id: 9,
        owner: {
        id: 109,
        email: "owner9@example.com",
        role: "USER"
        },
        order: 9,
        hourlyPrice: 35,
        dailyPrice: 350,
        weeklyPrice: 1700,
        monthlyPrice: 6000,
        isAvailable: "PENDING",
        description: "Западная парковка, место №1",
        parkingZoneDto: {
        id: 1008,
        title: "Западная зона",
        address: "ул. Западная, 5"
        }
    },
    {
        id: 10,
        owner: {
        id: 110,
        email: "owner10@example.com",
        role: "USER"
        },
        order: 10,
        hourlyPrice: 75,
        dailyPrice: 650,
        weeklyPrice: 3000,
        monthlyPrice: 11000,
        isAvailable: "ACTIVE",
        description: "Премиум парковка, место №1",
        parkingZoneDto: {
        id: 1009,
        title: "Премиум зона",
        address: "ул. Центральная, 4"
        }
    }
    ]


export default mockParkingSpacesAP;