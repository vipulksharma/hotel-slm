# UCP Hotel Booking Application

A sample hotel booking application built with Node.js and the Universal Commerce Protocol (UCP), featuring a modern UI inspired by tiket.com/hotel.

## Overview

This application demonstrates how to implement a hotel booking system using UCP (Universal Commerce Protocol), an open-source standard designed to power agentic commerce experiences. The app includes:

- **Backend API**: Node.js/Express server with UCP-compliant endpoints
- **Frontend**: Modern, responsive web interface inspired by tiket.com/hotel
- **UCP Integration**: Full support for discovery, checkout, and booking capabilities
- **Hardcoded Data**: Sample hotels and rooms for demonstration

## Features

- 🔍 Hotel search and filtering by location, price, and rating
- 🏨 Detailed hotel information with room listings
- 💳 UCP-compliant checkout process
- 🎟️ Discount code support (WELCOME10, SUMMER20, EARLYBIRD15)
- 📱 Responsive design for mobile and desktop
- ✅ Booking confirmation with unique confirmation numbers

## Project Structure

```
.
├── server/
│   ├── index.js              # Express server and API routes
│   ├── data/
│   │   └── hotels.js         # Hardcoded hotel and room data
│   └── services/
│       ├── discovery.js      # UCP discovery service
│       └── checkout.js       # UCP checkout service
├── public/
│   ├── index.html            # Main HTML page
│   ├── styles.css            # Styling
│   └── app.js                # Frontend JavaScript
├── package.json              # Dependencies
└── README.md                 # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone or navigate to the project directory:
```bash
cd /Users/vipulsharma/projects/automation
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### UCP Endpoints

- `GET /ucp/profile` - Discover business capabilities (UCP discovery)
- `POST /checkout-sessions` - Create a new checkout session
- `PUT /checkout-sessions/:id` - Update checkout session (e.g., apply discounts)
- `POST /checkout-sessions/:id/complete` - Complete checkout and create booking

### Hotel Endpoints

- `GET /api/hotels` - Get all hotels (supports query params: location, minPrice, maxPrice, rating)
- `GET /api/hotels/:id` - Get hotel details with rooms
- `GET /api/hotels/:id/rooms` - Get available rooms for a hotel
- `GET /api/bookings/:id` - Get booking details

### Health Check

- `GET /health` - Server health check

## UCP Implementation

This application implements UCP capabilities:

1. **Discovery**: Business capabilities are exposed via `/ucp/profile`
2. **Checkout**: Full checkout flow with line items, totals, and discounts
3. **Booking**: Order management with booking confirmations

The implementation follows UCP version `2026-01-11` specification.

## Sample Data

The application includes 6 sample hotels across Indonesia:
- Grand Marina Hotel (Jakarta)
- Bali Beach Resort (Bali)
- Yogyakarta Heritage Hotel (Yogyakarta)
- Bandung Mountain View Hotel (Bandung)
- Surabaya Business Hotel (Surabaya)
- Lombok Paradise Resort (Lombok)

Each hotel has associated rooms with different types and pricing.

## Discount Codes

Try these discount codes during checkout:
- `WELCOME10` - 10% off
- `SUMMER20` - 20% off
- `EARLYBIRD15` - 15% off

## Usage Example

1. **Search Hotels**: Use the search bar to filter by location
2. **View Details**: Click on any hotel card to see details and available rooms
3. **Book a Room**: Click "Book Now" on any room
4. **Apply Discount**: Enter a discount code (optional)
5. **Complete Booking**: Fill in your details and complete the booking
6. **Confirmation**: Receive a booking confirmation with confirmation number

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Protocol**: Universal Commerce Protocol (UCP)
- **Architecture**: RESTful API

## UCP Compliance

This implementation demonstrates:
- ✅ Capability discovery
- ✅ Checkout session management
- ✅ Discount extensions
- ✅ Payment handler integration
- ✅ Booking/order management

## Development

To modify hotel data, edit `server/data/hotels.js`.

To customize the UI, modify files in the `public/` directory.

## License

MIT

## References

- [Universal Commerce Protocol (UCP)](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
- [UCP GitHub Repository](https://github.com/Universal-Commerce-Protocol)

## Notes

- This is a demonstration application with hardcoded data
- Payment processing is simulated (mock payment handler)
- Bookings are stored in-memory and will be lost on server restart
- For production use, integrate with a proper database and payment gateway
