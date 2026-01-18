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

Use the AI-powered search box at the top to book hotels using natural language. The system understands various phrasings and will automatically parse your request, search for matching hotels, find the specified room type, and complete the booking.

### Complete Booking Examples

**Basic booking with all details:**
```
book a hotel in Jakarta checkin 2026-01-15 checkout 2026-01-16 for 2 guests with 4.5 star rating. book the executive suite for guest named vipul with email guest@m.com and phone number 9009900900
```

**Casual/conversational style:**
```
I need a hotel in Bali from January 15th to 16th for 2 people. Looking for something with 4 stars. Book the beachfront villa for John Doe, email john@example.com, phone 1234567890
```

**Formal request:**
```
Please book a hotel room in Yogyakarta. Check-in date: 2026-02-20, check-out date: 2026-02-22. Accommodation for 3 guests. Minimum rating: 4.5 stars. Room type: Heritage Room. Guest name: Jane Smith, email: jane.smith@email.com, contact: +62-812-3456-7890
```

**Quick booking:**
```
book hotel Jakarta 2026-01-15 to 2026-01-17 2 guests 4 star deluxe room name: Mike email: mike@test.com phone: 5551234
```

**With different date formats:**
```
Find me a hotel in Bandung check-in 01/15/2026 check-out 01/18/2026 for 4 guests. Need 4.7 star rating. Book mountain view room. Guest: Sarah Johnson, sarah@email.com, 9876543210
```

**Multiple preferences:**
```
I want to book a hotel in Surabaya from 2026-03-10 to 2026-03-12. Need it for 2 guests, at least 4.5 stars. Please book the business room for guest named Robert Chen, email robert.chen@company.com, phone number is 555-9876
```

**With room type variations:**
```
Book a deluxe room in Lombok. Check in 2026-04-01, check out 2026-04-05. For 3 guests. Hotel should be 4.8 stars. Guest details: Maria Garcia, maria.garcia@mail.com, 123-456-7890
```

### Search-Only Examples (Without Booking)

**Simple location search:**
```
show me hotels in Jakarta
```

**Search with filters:**
```
find hotels in Bali with 4.5 star rating
```

**Search with date range:**
```
hotels in Yogyakarta checkin 2026-02-15 checkout 2026-02-17
```

**Search with guest count:**
```
show hotels in Bandung for 4 guests
```

**Search with price range:**
```
find hotels in Surabaya under 600000 per night
```

**Combined search:**
```
hotels in Lombok for 2 guests checkin 2026-05-01 checkout 2026-05-03 with 4.7 stars
```

### Different Ways to Express Location

```
hotel in Jakarta
hotel at Jakarta
hotels in Bali
find hotels in Yogyakarta
show me hotels in Bandung
I need a hotel in Surabaya
book hotel Lombok
Jakarta hotels
Bali accommodation
```

### Different Date Formats Supported

```
checkin 2026-01-15 checkout 2026-01-16
check-in 2026-01-15 check-out 2026-01-16
check in 2026-01-15 check out 2026-01-16
from 2026-01-15 to 2026-01-16
January 15 to January 16, 2026
01/15/2026 to 01/16/2026
15-01-2026 to 16-01-2026
arriving 2026-01-15 departing 2026-01-16
```

### Different Ways to Express Guest Count

```
for 2 guests
for 2 people
for 2 persons
2 guests
2 people
accommodation for 3 guests
room for 4 people
```

### Different Ways to Express Rating

```
4.5 star rating
4.5 stars
4 star hotel
minimum 4.5 stars
at least 4 stars
4.8 star rating or higher
```

### Different Room Type Expressions

```
executive suite
deluxe room
delux room (also works)
beachfront villa
ocean view suite
heritage room
mountain view room
business room
garden villa
suite
villa
deluxe
executive
```

### Different Ways to Provide Guest Information

```
guest named John Doe
name: John Doe
guest name: John Doe
for John Doe
booked under John Doe
email john@example.com
email: john@example.com
phone 1234567890
phone number 1234567890
phone: 1234567890
contact 1234567890
mobile 1234567890
```

### Real-World Usage Examples

**Business trip:**
```
Book a business hotel in Jakarta from 2026-06-10 to 2026-06-12 for 1 guest. Need 4.5+ stars. Book business room for David Kim, david.kim@corp.com, +62-811-2345-6789
```

**Family vacation:**
```
I need a family-friendly hotel in Bali checkin 2026-07-15 checkout 2026-07-20 for 4 guests. Looking for 4.8 stars. Book beachfront villa for the Johnson family, email: johnson.family@email.com, phone: 555-1234-5678
```

**Romantic getaway:**
```
Find a romantic hotel in Lombok from 2026-08-01 to 2026-08-05 for 2 guests. Minimum 4.7 stars. Book garden villa for couple: Alex & Taylor, email: alex.taylor@mail.com, contact: 9876543210
```

**Weekend trip:**
```
Quick weekend booking: hotel in Bandung 2026-09-10 to 2026-09-12, 2 guests, 4 star, mountain view room. Guest: Sam Wilson, sam@email.com, 555-9876
```

**Last-minute booking:**
```
Urgent: hotel Jakarta today to tomorrow, 2 guests, any 4+ star hotel, deluxe room. Name: Lisa Park, lisa@email.com, 123-456-7890
```

**Group booking:**
```
Book hotel in Yogyakarta checkin 2026-10-05 checkout 2026-10-08 for 6 guests. Need 4.5 stars. Book heritage room for group leader: Tom Brown, tom.brown@group.com, phone: 555-1111-2222
```

### Tips for Best Results

1. **Include essential information**: Location, check-in date, check-out date, and guest count
2. **Be specific about preferences**: Room type, star rating, and guest details help get exactly what you want
3. **Flexible phrasing**: The system understands various ways to express the same information
4. **Date formats**: Use YYYY-MM-DD format for best results, but other formats are also supported
5. **Room types**: Use exact room type names for best matching, but partial matches also work

### What the System Does Automatically

1. **Parses your request** - Extracts location, dates, guests, preferences, and guest information
2. **Searches for hotels** - Finds hotels matching your location and rating criteria
3. **Matches room type** - Finds the specified room type (with flexible matching)
4. **Creates booking** - Automatically creates checkout session and completes booking
5. **Confirms booking** - Provides booking confirmation with unique confirmation number

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
