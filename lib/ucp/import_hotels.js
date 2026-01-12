// Import Hotels Script
// Following the pattern from UCP blog post: import_csv.py
// This script imports hardcoded hotels into the UCP business store

import { 
  addHotel, 
  addRoom, 
  clearStore,
  loadStore 
} from './store.js'
import { hotels as hotelData, rooms as roomData } from '../data/hotels.js'

/**
 * Import hotels and rooms into the UCP business store
 * Similar to: uv run import_csv.py --products_db_path=/tmp/ucp_test/products.db
 */
export function importHotels() {
  console.log('🏨 Starting hotel import to UCP business store...')
  
  // Clear existing data (optional - remove if you want to keep existing data)
  // clearStore()
  
  const store = loadStore()
  let importedHotels = 0
  let importedRooms = 0
  
  // Import hotels
  for (const hotel of hotelData) {
    // Check if hotel already exists
    const existing = store.hotels.find(h => h.id === hotel.id)
    if (!existing) {
      addHotel(hotel)
      importedHotels++
      console.log(`  ✓ Imported hotel: ${hotel.name} (${hotel.id})`)
    } else {
      console.log(`  ⊙ Hotel already exists: ${hotel.name} (${hotel.id})`)
    }
  }
  
  // Import rooms
  for (const room of roomData) {
    // Check if room already exists
    const existing = store.rooms.find(r => r.id === room.id)
    if (!existing) {
      addRoom(room)
      importedRooms++
      console.log(`  ✓ Imported room: ${room.type} (${room.id})`)
    } else {
      console.log(`  ⊙ Room already exists: ${room.type} (${room.id})`)
    }
  }
  
  console.log(`\n✅ Import complete!`)
  console.log(`   Hotels imported: ${importedHotels}`)
  console.log(`   Rooms imported: ${importedRooms}`)
  console.log(`   Store location: data/ucp_store.json`)
  
  return {
    hotels: importedHotels,
    rooms: importedRooms
  }
}

// Run import if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importHotels()
}
