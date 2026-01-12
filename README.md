# UCP Hotel Booking Application - Next.js 16

A sample hotel booking application built with **Next.js 16** and the Universal Commerce Protocol (UCP), featuring a modern UI inspired by tiket.com/hotel.

## Overview

This application demonstrates how to implement a hotel booking system using UCP (Universal Commerce Protocol), an open-source standard designed to power agentic commerce experiences. The app is built with:

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 18 with Server Components
- **Backend**: Next.js API Routes
- **UCP Integration**: Full support for discovery, checkout, and booking capabilities
- **Business Store**: UCP-compliant business server with persistent data store

## Features

- 🔍 Hotel search and filtering by location, price, and rating
- 🏨 Detailed hotel information with room listings
- 💳 UCP-compliant checkout process
- 🎟️ Discount code support (WELCOME10, SUMMER20, EARLYBIRD15)
- 🤖 AI-powered natural language booking
- 📱 Responsive design for mobile and desktop
- ✅ Booking confirmation with unique confirmation numbers
- 🗄️ UCP Business Store with persistent data storage

## Project Structure

```
.
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── hotels/            # Hotel endpoints
│   │   ├── checkout-sessions/ # Checkout endpoints
│   │   ├── bookings/          # Booking endpoints
│   │   └── ucp/               # UCP discovery
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   └── page.js                # Main page (client component)
├── lib/
│   ├── data/
│   │   ├── hotels.js          # Hotel and room data (fallback)
│   │   └── store_adapter.js  # Adapter for UCP store
│   ├── services/
│   │   ├── checkout.js        # Checkout service
│   │   └── discovery.js      # UCP discovery service
│   └── ucp/
│       ├── store.js          # UCP business store
│       └── import_hotels.js  # Hotel import script
├── scripts/
│   └── import-hotels.js      # Import script runner
├── data/
│   └── ucp_store.json        # UCP business store data (auto-generated)
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Navigate to the project directory:
```bash
cd /Users/vipulsharma/projects/automation
```

2. Install dependencies:
```bash
npm install
```

3. **Set up the UCP business server and import hotels:**
```bash
npm run import-hotels
```

This command will:
- Initialize the UCP business store
- Import all hardcoded hotels and rooms into the store
- Create `data/ucp_store.json` with all hotel data

Following the pattern from the [UCP blog post](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/), this is similar to running:
```bash
uv run import_csv.py --products_db_path=/tmp/ucp_test/products.db
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## UCP Business Server Setup

The application follows the UCP business server pattern from the [Google Developers blog post](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/):

1. **Business Store**: Hotels and rooms are stored in `data/ucp_store.json` (similar to SQLite database in Python example)
2. **Product Import**: Use `npm run import-hotels` to populate the store
3. **API Endpoints**: All endpoints follow UCP specification patterns

### Store Structure

The UCP store (`data/ucp_store.json`) contains:
- `hotels`: Array of hotel products
- `rooms`: Array of room products
- `bookings`: Array of completed bookings
- Metadata: `createdAt`, `updatedAt`, `version`

## API Endpoints

All API routes are available under `/api`:

### UCP Endpoints

- `GET /api/ucp/profile` - Discover business capabilities (UCP discovery)
- `POST /api/checkout-sessions` - Create a new checkout session
- `PUT /api/checkout-sessions/:id` - Update checkout session (e.g., apply discounts)
- `POST /api/checkout-sessions/:id/complete` - Complete checkout and create booking

### Hotel Endpoints

- `GET /api/hotels` - Get all hotels (supports query params: location, minPrice, maxPrice, rating)
- `GET /api/hotels/:id` - Get hotel details with rooms
- `GET /api/hotels/:id/rooms` - Get available rooms for a hotel
- `GET /api/bookings/:id` - Get booking details

### Health Check

- `GET /api/health` - Server health check

## UCP Implementation

This application implements UCP capabilities:

1. **Discovery**: Business capabilities are exposed via `/api/ucp/profile`
2. **Checkout**: Full checkout flow with line items, totals, and discounts
3. **Booking**: Order management with booking confirmations
4. **Business Store**: Persistent product storage following UCP patterns

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

All hotels are imported into the UCP business store on first run.

## Discount Codes

Try these discount codes during checkout:
- `WELCOME10` - 10% off
- `SUMMER20` - 20% off
- `EARLYBIRD15` - 15% off

## Natural Language Booking

Use the AI-powered search box at the top to book hotels using natural language:

**Example:**
```
book a hotel in Jakarta checkin 2026-01-15 checkout 2026-01-16 for 2 guests with 4.5 star rating. book the executive suite for guest named vipul with email guest@m.com and phone number 9009900900
```

The system will automatically:
1. Parse your request
2. Search for matching hotels
3. Find the specified room type
4. Create and complete the booking

## Usage Example

1. **Import Hotels**: Run `npm run import-hotels` to set up the business store
2. **Search Hotels**: Use the search bar to filter by location
3. **View Details**: Click on any hotel card to see details and available rooms
4. **Book a Room**: Click "Book Now" on any room
5. **Apply Discount**: Enter a discount code (optional)
6. **Complete Booking**: Fill in your details and complete the booking
7. **Confirmation**: Receive a booking confirmation with confirmation number

## Technologies Used

- **Framework**: Next.js 16
- **Frontend**: React 18
- **Styling**: CSS Modules / Global CSS
- **Protocol**: Universal Commerce Protocol (UCP)
- **Architecture**: App Router with API Routes
- **Storage**: JSON-based UCP business store

## UCP Compliance

This implementation demonstrates:
- ✅ Capability discovery
- ✅ Checkout session management
- ✅ Discount extensions
- ✅ Payment handler integration
- ✅ Booking/order management
- ✅ Business server setup with product store

## Development

### Modifying Hotel Data

1. Edit `lib/data/hotels.js` to add or modify hotels and rooms
2. Run `npm run import-hotels` to update the UCP store

### Customizing the UI

Modify `app/page.js` for the main page and `app/globals.css` for styling.

### Adding API Routes

Create new route files in `app/api/[route]/route.js` following Next.js 16 conventions.

## Migration from Express

This project was migrated from Express.js to Next.js 16. Key changes:
- Express routes → Next.js API routes (`app/api/`)
- Vanilla JS → React components
- Separate server/client → Unified Next.js app
- Hardcoded data → UCP business store

## References

- [Universal Commerce Protocol (UCP)](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
- [UCP GitHub Repository](https://github.com/Universal-Commerce-Protocol)
- [Next.js Documentation](https://nextjs.org/docs)

## Notes

- The UCP business store uses JSON file storage (similar to SQLite in Python example)
- Payment processing is simulated (mock payment handler)
- Bookings are persisted in the UCP store
- For production use, integrate with a proper database and payment gateway
- The natural language parser uses pattern matching; can be enhanced with LLM integration
