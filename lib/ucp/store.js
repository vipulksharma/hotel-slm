// UCP Business Store
// Following the pattern from https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/
// This acts as the business server's product store

import fs from 'fs'
import path from 'path'

// Detect if we're in a serverless environment (Vercel, AWS Lambda, etc.)
// In serverless, filesystem is read-only except /tmp, so we use in-memory storage
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || 
                     process.env.NEXT_RUNTIME === 'nodejs' || 
                     (typeof process.env.VERCEL_ENV !== 'undefined')

// In-memory store for serverless environments
let inMemoryStore = null

// Store file path (similar to SQLite database in the Python example)
// Use process.cwd() for Next.js compatibility
const STORE_PATH = path.join(process.cwd(), 'data', 'ucp_store.json')

// Check if filesystem is writable
function isFilesystemWritable() {
  if (isServerless) {
    // In serverless environments, filesystem is read-only except /tmp
    // We'll use in-memory storage instead
    return false
  }
  
  try {
    const storeDir = path.dirname(STORE_PATH)
    // Check if directory exists, if not try to create it
    if (!fs.existsSync(storeDir)) {
      try {
        fs.mkdirSync(storeDir, { recursive: true })
      } catch (mkdirError) {
        // Directory creation failed, filesystem not writable
        return false
      }
    }
    // Try to write a test file to verify write permissions
    const testPath = path.join(storeDir, '.test')
    try {
      fs.writeFileSync(testPath, 'test')
      fs.unlinkSync(testPath)
      return true
    } catch (writeError) {
      // Write test failed, filesystem not writable
      return false
    }
  } catch (error) {
    // Any other error means filesystem is not writable
    return false
  }
}

const filesystemWritable = isFilesystemWritable()

// Initialize store directory (only if filesystem is writable)
if (filesystemWritable) {
  const storeDir = path.dirname(STORE_PATH)
  if (!fs.existsSync(storeDir)) {
    try {
      fs.mkdirSync(storeDir, { recursive: true })
    } catch (error) {
      console.warn('Could not create store directory:', error.message)
    }
  }
}

// Initialize store if it doesn't exist
function initializeStore() {
  if (filesystemWritable) {
    try {
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
    } catch (error) {
      console.warn('Could not initialize store file:', error.message)
    }
  }
}

// Load store from file or memory
export function loadStore() {
  // If filesystem is not writable, use in-memory store
  if (!filesystemWritable) {
    if (!inMemoryStore) {
      // Try to read from file if it exists (read-only)
      try {
        if (fs.existsSync(STORE_PATH)) {
          const data = fs.readFileSync(STORE_PATH, 'utf8')
          inMemoryStore = JSON.parse(data)
        } else {
          // Initialize empty in-memory store
          inMemoryStore = {
            hotels: [],
            rooms: [],
            bookings: [],
            checkoutSessions: {},
            createdAt: new Date().toISOString(),
            version: '1.0.0'
          }
        }
      } catch (error) {
        console.warn('Could not load store from file, using empty in-memory store:', error.message)
        inMemoryStore = {
          hotels: [],
          rooms: [],
          bookings: [],
          checkoutSessions: {},
          createdAt: new Date().toISOString(),
          version: '1.0.0'
        }
      }
    }
    return inMemoryStore
  }
  
  // Filesystem is writable, use file-based store
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

// Save store to file or memory
export function saveStore(store) {
  store.updatedAt = new Date().toISOString()
  
  if (!filesystemWritable) {
    // Update in-memory store
    inMemoryStore = store
    return true
  }
  
  // Save to file
  try {
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
