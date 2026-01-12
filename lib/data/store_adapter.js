// Store Adapter
// Adapts the UCP business store to work with existing services
// This allows gradual migration from hardcoded data to UCP store

import { 
  getHotels, 
  getRooms, 
  getBookings,
  findHotelById,
  findRoomById,
  findBookingById,
  addBooking
} from '../ucp/store.js'
import { hotels as fallbackHotels, rooms as fallbackRooms } from './hotels.js'

// Use UCP store if available, otherwise fallback to hardcoded data
const USE_UCP_STORE = true

export function getHotelsData() {
  if (USE_UCP_STORE) {
    const storeHotels = getHotels()
    // If store is empty, return fallback
    return storeHotels.length > 0 ? storeHotels : fallbackHotels
  }
  return fallbackHotels
}

export function getRoomsData() {
  if (USE_UCP_STORE) {
    const storeRooms = getRooms()
    // If store is empty, return fallback
    return storeRooms.length > 0 ? storeRooms : fallbackRooms
  }
  return fallbackRooms
}

export function getBookingsData() {
  if (USE_UCP_STORE) {
    return getBookings()
  }
  return []
}

export function findHotel(hotelId) {
  if (USE_UCP_STORE) {
    const hotel = findHotelById(hotelId)
    if (hotel) return hotel
  }
  return fallbackHotels.find(h => h.id === hotelId)
}

export function findRoom(roomId) {
  if (USE_UCP_STORE) {
    const room = findRoomById(roomId)
    if (room) return room
  }
  return fallbackRooms.find(r => r.id === roomId)
}

export function findBooking(bookingId) {
  if (USE_UCP_STORE) {
    return findBookingById(bookingId)
  }
  return null
}

export function saveBooking(booking) {
  if (USE_UCP_STORE) {
    return addBooking(booking)
  }
  // Fallback: add to in-memory array (for backward compatibility)
  return booking
}
