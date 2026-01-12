# UCP Business Server Setup Guide

This guide explains how the UCP business server is set up following the pattern from the [Universal Commerce Protocol blog post](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/).

## Overview

The UCP business server follows the same pattern as the Python example in the blog post, but adapted for Node.js/Next.js:

- **Python Example**: Uses SQLite database (`products.db`)
- **Our Implementation**: Uses JSON file store (`data/ucp_store.json`)

Both serve the same purpose: storing business products (hotels and rooms) in a persistent store.

## Setup Steps

### 1. Initialize the Business Store

The business store is automatically initialized when you run the import script. The store file is created at:
```
data/ucp_store.json
```

### 2. Import Hotels to the Store

Run the import script (similar to `import_csv.py` in the Python example):

```bash
npm run import-hotels
```

This command:
- Creates the UCP business store if it doesn't exist
- Imports all hotels from `lib/data/hotels.js`
- Imports all rooms from `lib/data/hotels.js`
- Saves everything to `data/ucp_store.json`

**Output:**
```
🚀 UCP Business Server - Hotel Import
=====================================

🏨 Starting hotel import to UCP business store...
  ✓ Imported hotel: Grand Marina Hotel (hotel_1)
  ✓ Imported hotel: Bali Beach Resort (hotel_2)
  ...
  ✓ Imported room: Deluxe Room (room_1_1)
  ...

✅ Import complete!
   Hotels imported: 6
   Rooms imported: 8
   Store location: data/ucp_store.json
```

### 3. Verify the Store

Check that the store was created:

```bash
ls -la data/ucp_store.json
cat data/ucp_store.json
```

## Store Structure

The UCP store follows this structure:

```json
{
  "hotels": [
    {
      "id": "hotel_1",
      "name": "Grand Marina Hotel",
      "location": "Jakarta, Indonesia",
      ...
    }
  ],
  "rooms": [
    {
      "id": "room_1_1",
      "hotelId": "hotel_1",
      "type": "Deluxe Room",
      ...
    }
  ],
  "bookings": [],
  "createdAt": "2026-01-12T...",
  "updatedAt": "2026-01-12T...",
  "version": "1.0.0"
}
```

## Architecture

### Components

1. **UCP Store** (`lib/ucp/store.js`)
   - Manages persistent storage
   - Provides CRUD operations for hotels, rooms, and bookings
   - Similar to database layer in Python example

2. **Import Script** (`lib/ucp/import_hotels.js`)
   - Imports hardcoded hotels into the store
   - Similar to `import_csv.py` in Python example

3. **Store Adapter** (`lib/data/store_adapter.js`)
   - Adapts UCP store to work with existing services
   - Provides fallback to hardcoded data if store is empty
   - Allows gradual migration

4. **Services** (Updated)
   - `lib/services/checkout.js` - Uses store adapter
   - API routes - Use store adapter for data access

## Comparison with Python Example

| Python Example | Our Implementation |
|---------------|-------------------|
| `import_csv.py` | `scripts/import-hotels.js` |
| SQLite database | JSON file store |
| `products.db` | `data/ucp_store.json` |
| Python server | Next.js API routes |
| `uv sync` | `npm install` |

## Usage

### Adding New Hotels

1. Edit `lib/data/hotels.js` to add new hotels/rooms
2. Run `npm run import-hotels` to update the store

### Accessing Store Data

The store is accessed through the store adapter:

```javascript
import { getHotelsData, getRoomsData } from '@/lib/data/store_adapter'

const hotels = getHotelsData()
const rooms = getRoomsData()
```

### API Endpoints

All API endpoints automatically use the UCP store:
- `GET /api/hotels` - Returns hotels from store
- `GET /api/hotels/:id` - Returns hotel from store
- `POST /api/checkout-sessions/:id/complete` - Saves booking to store

## Benefits

1. **Persistent Storage**: Bookings are saved to the store (unlike in-memory arrays)
2. **UCP Compliance**: Follows the business server pattern from UCP documentation
3. **Easy Migration**: Can easily switch to a real database later
4. **Data Integrity**: Centralized data management

## Next Steps

For production, consider:
- Replacing JSON file with a real database (PostgreSQL, MongoDB, etc.)
- Adding data validation
- Implementing backup/restore functionality
- Adding data migration scripts

## References

- [UCP Blog Post](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
- [UCP GitHub Repository](https://github.com/Universal-Commerce-Protocol)
