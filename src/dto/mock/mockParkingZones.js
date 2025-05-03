export const mockParkingZones = [
    {
      id: 1,
      title: "Парковка на проспекте Кирова",
      address: "Проспект Кирова, Саратов",
      parkingSpacesCount: 20,
      latitude: 51.533562,
      longitude: 46.034257,
      rev: [
        {
          id: 1,
          client: { email: "user1@example.com" },
          comment: "Очень удобная парковка, всегда есть места!",
          rating: 4,
          createdAt: "2025-04-26T10:00:00",
        },
        {
          id: 2,
          client: { email: "user1@example.com" },
          comment: "Очень удобная парковка, всегда есть места!",
          rating: 5,
          createdAt: "2025-04-26T10:00:00",
        }
      ],
    },
    {
      id: 2,
      title: "Парковка у набережной",
      address: "Улица Чернышевского, Саратов",
      parkingSpacesCount: 15,
      latitude: 51.530120,
      longitude: 46.014982,
      rev: [
        {
          id: 2,
          client: { email: "user2@example.com" },
          comment: "Парковка не очень удобная, часто занята.",
          rating: 3,
          createdAt: "2025-04-25T14:30:00",
        },
      ],
    },
  ];
  