const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { hotels, rooms, bookings } = require('./data/hotels');
const { createCheckoutSession, updateCheckoutSession, completeCheckout } = require('./services/checkout');
const { discoverCapabilities } = require('./services/discovery');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// UCP Discovery endpoint
app.get('/ucp/profile', (req, res) => {
  const profile = discoverCapabilities();
  res.json(profile);
});

// Get all hotels
app.get('/api/hotels', (req, res) => {
  const { location, minPrice, maxPrice, rating } = req.query;
  
  let filteredHotels = [...hotels];
  
  if (location) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (minPrice) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.pricePerNight >= parseInt(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.pricePerNight <= parseInt(maxPrice)
    );
  }
  
  if (rating) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.rating >= parseFloat(rating)
    );
  }
  
  res.json({
    hotels: filteredHotels,
    total: filteredHotels.length
  });
});

// Get hotel by ID
app.get('/api/hotels/:id', (req, res) => {
  const hotel = hotels.find(h => h.id === req.params.id);
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }
  
  const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
  res.json({
    ...hotel,
    rooms: hotelRooms
  });
});

// Get available rooms for a hotel
app.get('/api/hotels/:id/rooms', (req, res) => {
  const { checkIn, checkOut, guests } = req.query;
  const hotelRooms = rooms.filter(r => r.hotelId === req.params.id);
  
  // Simple availability check (in production, this would check actual bookings)
  const availableRooms = hotelRooms.filter(room => {
    if (guests && room.maxGuests < parseInt(guests)) return false;
    return true;
  });
  
  res.json({
    rooms: availableRooms,
    checkIn,
    checkOut,
    guests: guests || 1
  });
});

// UCP Checkout - Create checkout session
app.post('/checkout-sessions', (req, res) => {
  try {
    const session = createCheckoutSession(req.body);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UCP Checkout - Update checkout session
app.put('/checkout-sessions/:id', (req, res) => {
  try {
    const session = updateCheckoutSession(req.params.id, req.body);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UCP Checkout - Complete checkout
app.post('/checkout-sessions/:id/complete', (req, res) => {
  try {
    const booking = completeCheckout(req.params.id, req.body);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 UCP Hotel Booking API running on http://localhost:${PORT}`);
  console.log(`📋 UCP Profile: http://localhost:${PORT}/ucp/profile`);
});
