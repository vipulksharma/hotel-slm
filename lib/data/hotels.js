// Hardcoded hotel data
export const hotels = [
  {
    id: 'hotel_1',
    name: 'Grand Marina Hotel',
    location: 'Jakarta, Indonesia',
    address: 'Jl. Sudirman No. 1, Jakarta Pusat',
    pricePerNight: 850000,
    currency: 'IDR',
    rating: 4.8,
    reviewCount: 1245,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Parking', 'Airport Shuttle'],
    description: 'Luxurious 5-star hotel in the heart of Jakarta with stunning city views and world-class amenities.',
    latitude: -6.2088,
    longitude: 106.8456
  },
  {
    id: 'hotel_2',
    name: 'Bali Beach Resort',
    location: 'Bali, Indonesia',
    address: 'Jl. Pantai Kuta, Kuta, Bali',
    pricePerNight: 1200000,
    currency: 'IDR',
    rating: 4.9,
    reviewCount: 2156,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
    ],
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Water Sports'],
    description: 'Beachfront resort with direct access to pristine white sand beaches and crystal clear waters.',
    latitude: -8.4095,
    longitude: 115.1889
  },
  {
    id: 'hotel_3',
    name: 'Yogyakarta Heritage Hotel',
    location: 'Yogyakarta, Indonesia',
    address: 'Jl. Malioboro No. 52, Yogyakarta',
    pricePerNight: 650000,
    currency: 'IDR',
    rating: 4.6,
    reviewCount: 892,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ],
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Tour Desk', 'Cultural Tours'],
    description: 'Charming heritage hotel combining traditional Javanese architecture with modern comforts.',
    latitude: -7.7956,
    longitude: 110.3695
  },
  {
    id: 'hotel_4',
    name: 'Bandung Mountain View Hotel',
    location: 'Bandung, Indonesia',
    address: 'Jl. Dago No. 88, Bandung',
    pricePerNight: 750000,
    currency: 'IDR',
    rating: 4.7,
    reviewCount: 1034,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking', 'Mountain View', 'Hiking Tours'],
    description: 'Scenic hotel overlooking the mountains with fresh air and beautiful natural surroundings.',
    latitude: -6.9175,
    longitude: 107.6191
  },
  {
    id: 'hotel_5',
    name: 'Surabaya Business Hotel',
    location: 'Surabaya, Indonesia',
    address: 'Jl. Pemuda No. 123, Surabaya',
    pricePerNight: 550000,
    currency: 'IDR',
    rating: 4.5,
    reviewCount: 678,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
    ],
    amenities: ['WiFi', 'Business Center', 'Meeting Rooms', 'Restaurant', 'Parking', 'Airport Shuttle'],
    description: 'Modern business hotel perfect for corporate travelers with excellent facilities and location.',
    latitude: -7.2575,
    longitude: 112.7521
  },
  {
    id: 'hotel_6',
    name: 'Lombok Paradise Resort',
    location: 'Lombok, Indonesia',
    address: 'Pantai Senggigi, Lombok Barat',
    pricePerNight: 950000,
    currency: 'IDR',
    rating: 4.8,
    reviewCount: 1456,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    ],
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant', 'Diving', 'Snorkeling'],
    description: 'Tropical paradise resort with private beach access and world-class diving facilities.',
    latitude: -8.4870,
    longitude: 116.0403
  }
];

export const rooms = [
  // Grand Marina Hotel rooms
  {
    id: 'room_1_1',
    hotelId: 'hotel_1',
    type: 'Deluxe Room',
    description: 'Spacious room with city view',
    maxGuests: 2,
    pricePerNight: 850000,
    currency: 'IDR',
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    available: true
  },
  {
    id: 'room_1_2',
    hotelId: 'hotel_1',
    type: 'Executive Suite',
    description: 'Luxurious suite with separate living area',
    maxGuests: 4,
    pricePerNight: 1500000,
    currency: 'IDR',
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Jacuzzi', 'Balcony'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    available: true
  },
  // Bali Beach Resort rooms
  {
    id: 'room_2_1',
    hotelId: 'hotel_2',
    type: 'Beachfront Villa',
    description: 'Private villa with direct beach access',
    maxGuests: 4,
    pricePerNight: 1200000,
    currency: 'IDR',
    amenities: ['WiFi', 'TV', 'AC', 'Kitchen', 'Private Pool', 'Beach Access'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    available: true
  },
  {
    id: 'room_2_2',
    hotelId: 'hotel_2',
    type: 'Ocean View Suite',
    description: 'Stunning ocean views from your room',
    maxGuests: 2,
    pricePerNight: 1800000,
    currency: 'IDR',
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Ocean View'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    available: true
  },
  // Yogyakarta Heritage Hotel rooms
  {
    id: 'room_3_1',
    hotelId: 'hotel_3',
    type: 'Heritage Room',
    description: 'Traditional Javanese style room',
    maxGuests: 2,
    pricePerNight: 650000,
    currency: 'IDR',
    amenities: ['WiFi', 'TV', 'AC', 'Traditional Decor'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    available: true
  },
  // Bandung Mountain View Hotel rooms
  {
    id: 'room_4_1',
    hotelId: 'hotel_4',
    type: 'Mountain View Room',
    description: 'Room with panoramic mountain views',
    maxGuests: 2,
    pricePerNight: 750000,
    currency: 'IDR',
    amenities: ['WiFi', 'TV', 'AC', 'Balcony', 'Mountain View'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    available: true
  },
  // Surabaya Business Hotel rooms
  {
    id: 'room_5_1',
    hotelId: 'hotel_5',
    type: 'Business Room',
    description: 'Comfortable room for business travelers',
    maxGuests: 2,
    pricePerNight: 550000,
    currency: 'IDR',
    amenities: ['WiFi', 'TV', 'AC', 'Desk', 'Work Area'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    available: true
  },
  // Lombok Paradise Resort rooms
  {
    id: 'room_6_1',
    hotelId: 'hotel_6',
    type: 'Garden Villa',
    description: 'Villa surrounded by tropical gardens',
    maxGuests: 3,
    pricePerNight: 950000,
    currency: 'IDR',
    amenities: ['WiFi', 'TV', 'AC', 'Private Garden', 'Outdoor Shower'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    available: true
  }
];

// In-memory bookings storage (in production, use a database)
export const bookings = [];
