// UCP Business Store
// Following the pattern from https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/
// This acts as the business server's product store

import fs from 'fs'
import path from 'path'

// Store file path (similar to SQLite database in the Python example)
// Use process.cwd() for Next.js compatibility
const STORE_PATH = path.join(process.cwd(), 'data', 'ucp_store.json')

// Initialize store directory
const storeDir = path.dirname(STORE_PATH)
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true })
}

// Initialize store if it doesn't exist
function initializeStore() {
  if (!fs.existsSync(STORE_PATH)) {
    const initialStore = {
      hotels: [],
      rooms: [],
      bookings: [],
      checkoutSessions: {},
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialStore, null, 2))
  }
}

// Load store from file
export function loadStore() {
  initializeStore()
  try {
    const data = fs.readFileSync(STORE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading store:', error)
    return {
      hotels: [],
      rooms: [],
      bookings: [],
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    }
  }
}

// Save store to file
export function saveStore(store) {
  try {
    store.updatedAt = new Date().toISOString()
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
    return true
  } catch (error) {
    console.error('Error saving store:', error)
    return false
  }
}

// Get all hotels from store
export function getHotels() {
  const store = loadStore()
  return store.hotels || []
}

// Get all rooms from store
export function getRooms() {
  const store = loadStore()
  return store.rooms || []
}

// Get all bookings from store
export function getBookings() {
  const store = loadStore()
  return store.bookings || []
}

// Add hotel to store
export function addHotel(hotel) {
  const store = loadStore()
  if (!store.hotels) store.hotels = []
  store.hotels.push(hotel)
  saveStore(store)
  return hotel
}

// Add room to store
export function addRoom(room) {
  const store = loadStore()
  if (!store.rooms) store.rooms = []
  store.rooms.push(room)
  saveStore(store)
  return room
}

// Add booking to store
export function addBooking(booking) {
  const store = loadStore()
  if (!store.bookings) store.bookings = []
  store.bookings.push(booking)
  saveStore(store)
  return booking
}

// Update hotel in store
export function updateHotel(hotelId, updates) {
  const store = loadStore()
  const index = store.hotels.findIndex(h => h.id === hotelId)
  if (index !== -1) {
    store.hotels[index] = { ...store.hotels[index], ...updates }
    saveStore(store)
    return store.hotels[index]
  }
  return null
}

// Find hotel by ID
export function findHotelById(hotelId) {
  const store = loadStore()
  return store.hotels.find(h => h.id === hotelId) || null
}

// Find room by ID
export function findRoomById(roomId) {
  const store = loadStore()
  return store.rooms.find(r => r.id === roomId) || null
}

// Find booking by ID
export function findBookingById(bookingId) {
  const store = loadStore()
  return store.bookings.find(b => b.id === bookingId) || null
}

// Checkout Sessions Management
export function getCheckoutSession(sessionId) {
  const store = loadStore()
  return store.checkoutSessions?.[sessionId] || null
}

export function saveCheckoutSession(session) {
  const store = loadStore()
  if (!store.checkoutSessions) store.checkoutSessions = {}
  store.checkoutSessions[session.id] = session
  saveStore(store)
  return session
}

export function updateCheckoutSessionInStore(sessionId, updates) {
  const store = loadStore()
  if (!store.checkoutSessions) store.checkoutSessions = {}
  if (store.checkoutSessions[sessionId]) {
    store.checkoutSessions[sessionId] = { ...store.checkoutSessions[sessionId], ...updates }
    saveStore(store)
    return store.checkoutSessions[sessionId]
  }
  return null
}

export function deleteCheckoutSession(sessionId) {
  const store = loadStore()
  if (store.checkoutSessions && store.checkoutSessions[sessionId]) {
    delete store.checkoutSessions[sessionId]
    saveStore(store)
    return true
  }
  return false
}

// Clear all data (for testing/reset)
export function clearStore() {
  const emptyStore = {
    hotels: [],
    rooms: [],
    bookings: [],
    checkoutSessions: {},
    createdAt: new Date().toISOString(),
    version: '1.0.0'
  }
  saveStore(emptyStore)
}
