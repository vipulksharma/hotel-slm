'use client'

import { useState, useEffect } from 'react'
import './globals.css'

const API_BASE = ''

export default function Home() {
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [checkoutSession, setCheckoutSession] = useState(null)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [nlQuery, setNlQuery] = useState('')
  const [nlStatus, setNlStatus] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(null)
  
  // Booking form fields
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  
  // Search filters
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(2000000)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    // Set default dates
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setCheckIn(today.toISOString().split('T')[0])
    setCheckOut(tomorrow.toISOString().split('T')[0])
    
    loadHotels()
  }, [])

  useEffect(() => {
    filterHotels()
  }, [hotels, location, priceMin, priceMax, rating])

  const loadHotels = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/hotels`)
      const data = await response.json()
      setHotels(data.hotels)
      setFilteredHotels(data.hotels)
    } catch (error) {
      console.error('Error loading hotels:', error)
    }
  }

  const filterHotels = () => {
    let filtered = [...hotels]
    
    if (location) {
      filtered = filtered.filter(hotel => 
        hotel.location.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    if (priceMin > 0) {
      filtered = filtered.filter(hotel => hotel.pricePerNight >= priceMin)
    }
    
    if (priceMax < 2000000) {
      filtered = filtered.filter(hotel => hotel.pricePerNight <= priceMax)
    }
    
    if (rating > 0) {
      filtered = filtered.filter(hotel => hotel.rating >= rating)
    }
    
    setFilteredHotels(filtered)
  }

  const searchHotels = async () => {
    const params = new URLSearchParams()
    if (location) params.append('location', location)
    
    try {
      const response = await fetch(`${API_BASE}/api/hotels?${params}`)
      const data = await response.json()
      setHotels(data.hotels)
      setFilteredHotels(data.hotels)
    } catch (error) {
      console.error('Error searching hotels:', error)
    }
  }

  const showHotelDetails = async (hotelId) => {
    try {
      const response = await fetch(`${API_BASE}/api/hotels/${hotelId}`)
      if (!response.ok) {
        throw new Error('Failed to load hotel details')
      }
      const hotel = await response.json()
      // Ensure rooms and amenities are arrays
      if (!hotel.rooms) hotel.rooms = []
      if (!hotel.amenities) hotel.amenities = []
      if (!hotel.images) hotel.images = []
      setSelectedHotel(hotel)
      setShowHotelModal(true)
    } catch (error) {
      console.error('Error loading hotel details:', error)
      alert('Error loading hotel details')
    }
  }

  const startBooking = async (hotelId, roomId) => {
    setShowHotelModal(false)
    
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates')
      return
    }
    
    try {
      let hotel = selectedHotel
      if (!hotel || !hotel.rooms) {
        const hotelResponse = await fetch(`${API_BASE}/api/hotels/${hotelId}`)
        hotel = await hotelResponse.json()
      }
      
      const response = await fetch(`${API_BASE}/api/checkout-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId,
          roomId,
          checkIn,
          checkOut,
          guests: parseInt(guests),
          currency: 'IDR'
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }
      
      const session = await response.json()
      setCheckoutSession(session)
      setSelectedHotel(hotel)
      setShowBookingModal(true)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Error starting booking process: ' + error.message)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
  }

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      alert('Please enter a discount code')
      return
    }

    if (!checkoutSession) return

    try {
      const response = await fetch(`${API_BASE}/api/checkout-sessions/${checkoutSession.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...checkoutSession,
          discounts: {
            codes: [discountCode.trim().toUpperCase()]
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Invalid discount code')
      }

      const updatedSession = await response.json()
      setCheckoutSession(updatedSession)
    } catch (error) {
      console.error('Error applying discount:', error)
      alert('Invalid discount code')
    }
  }

  const completeBooking = async () => {
    if (!buyerName || !buyerEmail || !buyerPhone) {
      alert('Please fill in all required fields')
      return
    }

    if (!checkoutSession) return

    try {
      const response = await fetch(`${API_BASE}/api/checkout-sessions/${checkoutSession.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: {
            full_name: buyerName,
            email: buyerEmail,
            phone: buyerPhone
          },
          payment: {
            method: 'credit_card',
            token: 'success_token'
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to complete booking'
        console.error('Booking error:', errorMessage, 'Session ID:', checkoutSession?.id)
        alert(`Error completing booking: ${errorMessage}`)
        return
      }

      const booking = await response.json()
      setBookingConfirmed(booking)
      
      // Reset form
      setBuyerName('')
      setBuyerEmail('')
      setBuyerPhone('')
      setDiscountCode('')
      
      // Refresh hotels
      loadHotels()
    } catch (error) {
      console.error('Error completing booking:', error)
      alert(`Error completing booking: ${error.message || 'Please try again.'}`)
    }
  }

  // Helper function to normalize dates
  const normalizeDate = (dateStr) => {
    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr
    }
    
    // Try to parse other formats
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    
    return dateStr
  }

  // Helper function to parse written dates like "January 15th"
  const parseWrittenDate = (dateStr, defaultYear = new Date().getFullYear()) => {
    const months = {
      'january': '01', 'jan': '01',
      'february': '02', 'feb': '02',
      'march': '03', 'mar': '03',
      'april': '04', 'apr': '04',
      'may': '05',
      'june': '06', 'jun': '06',
      'july': '07', 'jul': '07',
      'august': '08', 'aug': '08',
      'september': '09', 'sep': '09', 'sept': '09',
      'october': '10', 'oct': '10',
      'november': '11', 'nov': '11',
      'december': '12', 'dec': '12'
    }
    
    if (!dateStr || !dateStr.trim()) return null
    
    const lowerDate = dateStr.toLowerCase().trim()
    
    // Try to match patterns like "January 15th" or "Jan 15" or "January 15, 2026"
    const patterns = [
      /(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?/i,
      /(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)(?:\s*,?\s*(\d{4}))?/i
    ]
    
    for (const pattern of patterns) {
      const match = lowerDate.match(pattern)
      if (match) {
        let month, day, year
        // Check if first match is a month name
        const firstIsMonth = Object.keys(months).some(m => match[1].toLowerCase().startsWith(m.toLowerCase()))
        
        if (firstIsMonth) {
          // First pattern: month day
          const monthKey = Object.keys(months).find(m => match[1].toLowerCase().startsWith(m.toLowerCase()))
          if (monthKey) {
            month = months[monthKey]
            day = parseInt(match[2]).toString().padStart(2, '0')
            year = match[3] ? match[3] : defaultYear.toString()
            return `${year}-${month}-${day}`
          }
        } else {
          // Second pattern: day month
          day = parseInt(match[1]).toString().padStart(2, '0')
          const monthKey = Object.keys(months).find(m => match[2].toLowerCase().startsWith(m.toLowerCase()))
          if (monthKey) {
            month = months[monthKey]
            year = match[3] ? match[3] : defaultYear.toString()
            return `${year}-${month}-${day}`
          }
        }
      }
    }
    
    return null
  }

  // Natural Language Processing functions (simplified - full version would be in a separate file)
  const parseNaturalLanguageQuery = (query) => {
    const lowerQuery = query.toLowerCase()
    
    // Detect action type
    let action = 'book' // default: complete booking
    if (lowerQuery.includes('show') && (lowerQuery.includes('room') || lowerQuery.includes('room types'))) {
      action = 'show_rooms'
    } else if ((lowerQuery.includes('show') || lowerQuery.includes('find') || lowerQuery.includes('search')) && 
               (lowerQuery.includes('hotel') || lowerQuery.includes('hotels'))) {
      action = 'search' // Search-only query, doesn't require dates
    } else if (lowerQuery.match(/^hotel\s+at\s+/i) || lowerQuery.match(/^hotels?\s+at\s+/i)) {
      action = 'search' // "hotel at [city]" is a search query
    } else if (lowerQuery.includes('select') && lowerQuery.includes('room') && (lowerQuery.includes('form') || lowerQuery.includes('booking'))) {
      action = 'select_room'
    } else if (lowerQuery.includes('book') || lowerQuery.includes('email') || lowerQuery.includes('phone')) {
      action = 'book'
    }
    
    // Extract city - enhanced patterns (stop before dates, numbers, or common booking words)
    const cityPatterns = [
      /(?:show|find|search)\s+(?:me\s+)?(?:hotels?\s+)?(?:in|at)\s+([a-zA-Z]+)(?:\s+with|\s+under|\s*\.|$)/i,
      /hotel\s+at\s+([a-zA-Z]+)(?:\s*\.|$)/i,
      /hotels?\s+at\s+([a-zA-Z]+)(?:\s*\.|$)/i,
      /(?:please\s+)?book\s+(?:a\s+)?(?:deluxe|executive|beachfront|ocean\s+view|heritage|mountain\s+view|business|garden)?\s*(?:room|suite|villa)?\s+in\s+([a-zA-Z]+)(?:\s*\.|\s+check|\s+\d{4}|$)/i,
      /(?:please\s+)?book\s+(?:a\s+)?(?:hotel\s+)?room\s+in\s+([a-zA-Z]+)(?:\s*\.|\s+check|\s+\d{4}|$)/i,
      /book\s+(?:a\s+)?hotel\s+([a-zA-Z]+)(?:\s+\d{4}|\s+from|\s+checkin|\s+check-in|\s+checkout|\s+check-out|\s+for\s+\d|$)/i,
      /need\s+(?:a\s+)?hotel\s+in\s+([a-zA-Z]+)(?:\s+from|\s+checkin|\s+check-in|\s+checkout|\s+check-out|\s+for\s+\d|$)/i,
      /book\s+(?:a\s+)?hotel\s+in\s+([a-zA-Z]+)(?:\s+from|\s+checkin|\s+check-in|\s+checkout|\s+check-out|\s+arriving|\s+departing|\s+for\s+\d|$)/i,
      /hotel\s+(?:room\s+)?in\s+([a-zA-Z]+)(?:\s+from|\s+checkin|\s+check-in|\s+checkout|\s+check-out|\s+arriving|\s+departing|\s+for\s+\d|$)/i,
      /(?:in|at)\s+([a-zA-Z]+)(?:\s+from|\s+checkin|\s+check-in|\s+checkout|\s+check-out|\s+arriving|\s+departing|\s+for\s+\d|\s+looking|$)/i
    ]
    let city = null
    for (const pattern of cityPatterns) {
      const match = query.match(pattern)
      if (match) {
        city = match[1].trim()
        // Clean up - remove any trailing words that aren't part of the city name
        city = city.split(/\s+/)[0] // Take only the first word (city name)
        break
      }
    }
    
    // Extract dates - support multiple formats including "from...to" and simple date ranges
    let checkIn = null
    let checkOut = null
    
    // First try simple date range format (e.g., "2026-01-15 to 2026-01-17")
    const dateRangePattern = /(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/i
    const dateRangeMatch = query.match(dateRangePattern)
    if (dateRangeMatch) {
      checkIn = normalizeDate(dateRangeMatch[1])
      checkOut = normalizeDate(dateRangeMatch[2])
    }
    
    // If not found, try "from...to" pattern (e.g., "from January 15th to 16th")
    if (!checkIn || !checkOut) {
      const fromToPatterns = [
        /from\s+([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)\s+to\s+(\d{1,2}(?:st|nd|rd|th)?|[a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)(?:\s+for|\s+with|\s+looking|$)/i,
        /from\s+([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?)\s+to\s+(\d{1,2}(?:st|nd|rd|th)?)/i
      ]
      
      for (const pattern of fromToPatterns) {
        const fromToMatch = query.match(pattern)
        if (fromToMatch) {
          const fromDate = fromToMatch[1].trim()
          const toDate = fromToMatch[2].trim()
          
          // Try to parse written dates
          const parsedFrom = parseWrittenDate(fromDate)
          const parsedTo = parseWrittenDate(toDate)
          
          if (parsedFrom) checkIn = parsedFrom
          if (parsedTo) checkOut = parsedTo
          
          // If "to" date is just a day number (like "16th"), use same month/year as "from"
          if (!parsedTo && parsedFrom) {
            const fromParts = parsedFrom.split('-')
            const dayMatch = toDate.match(/(\d{1,2})(?:st|nd|rd|th)?/i)
            if (dayMatch) {
              const day = parseInt(dayMatch[1]).toString().padStart(2, '0')
              checkOut = `${fromParts[0]}-${fromParts[1]}-${day}`
            }
          }
          
          // If we got both dates, we're done
          if (checkIn && checkOut) break
        }
      }
    }
    
    // If not found, try checkin/checkout patterns (including formal formats with colons and commas)
    if (!checkIn) {
      const checkInPatterns = [
        /arriving\s+(\d{4}-\d{2}-\d{2})/i,
        /arriving\s+(\d{2}\/\d{2}\/\d{4})/i,
        /arriving\s+(\d{2}-\d{2}-\d{4})/i,
        /(?:check-in\s+date|checkin\s+date|check\s+in\s+date)[:\s]+(\d{4}-\d{2}-\d{2})/i,
        /(?:check-in\s+date|checkin\s+date|check\s+in\s+date)[:\s]+(\d{2}\/\d{2}\/\d{4})/i,
        /(?:check-in\s+date|checkin\s+date|check\s+in\s+date)[:\s]+(\d{2}-\d{2}-\d{4})/i,
        /(?:checkin|check-in|check\s+in)[:\s,]+(\d{4}-\d{2}-\d{2})/i,
        /(?:checkin|check-in|check\s+in)\s+(\d{4}-\d{2}-\d{2})(?:\s*,|$)/i,
        /(?:checkin|check-in|check\s+in)\s+(\d{2}\/\d{2}\/\d{4})/i,
        /(?:checkin|check-in|check\s+in)\s+(\d{2}-\d{2}-\d{4})/i,
        /(?:checkin|check-in|check\s+in)\s+([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)/i
      ]
      for (const pattern of checkInPatterns) {
        const match = query.match(pattern)
        if (match) {
          if (match[1].match(/[a-zA-Z]/)) {
            checkIn = parseWrittenDate(match[1])
          } else {
            checkIn = normalizeDate(match[1])
          }
          if (checkIn) break
        }
      }
    }
    
    if (!checkOut) {
      const checkOutPatterns = [
        /departing\s+(\d{4}-\d{2}-\d{2})/i,
        /departing\s+(\d{2}\/\d{2}\/\d{4})/i,
        /departing\s+(\d{2}-\d{2}-\d{4})/i,
        /(?:check-out\s+date|checkout\s+date|check\s+out\s+date)[:\s]+(\d{4}-\d{2}-\d{2})/i,
        /(?:check-out\s+date|checkout\s+date|check\s+out\s+date)[:\s]+(\d{2}\/\d{2}\/\d{4})/i,
        /(?:check-out\s+date|checkout\s+date|check\s+out\s+date)[:\s]+(\d{2}-\d{2}-\d{4})/i,
        /(?:checkout|check-out|check\s+out)[:\s,]+(\d{4}-\d{2}-\d{2})/i,
        /(?:checkout|check-out|check\s+out)\s+(\d{4}-\d{2}-\d{2})(?:\s*\.|$)/i,
        /(?:checkout|check-out|check\s+out)\s+(\d{2}\/\d{2}\/\d{4})/i,
        /(?:checkout|check-out|check\s+out)\s+(\d{2}-\d{2}-\d{4})/i,
        /(?:checkout|check-out|check\s+out)\s+([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)/i
      ]
      for (const pattern of checkOutPatterns) {
        const match = query.match(pattern)
        if (match) {
          if (match[1].match(/[a-zA-Z]/)) {
            checkOut = parseWrittenDate(match[1])
          } else {
            checkOut = normalizeDate(match[1])
          }
          if (checkOut) break
        }
      }
    }
    
    // Extract guests - support "people" and "persons" in addition to "guests"
    const guestsPatterns = [
      /(?:for\s+)?(\d+)\s+guests?/i,
      /(?:for\s+)?(\d+)\s+people/i,
      /(?:for\s+)?(\d+)\s+persons?/i,
      /accommodation\s+for\s+(\d+)/i
    ]
    let guests = 2 // default
    for (const pattern of guestsPatterns) {
      const match = query.match(pattern)
      if (match) {
        guests = parseInt(match[1])
        break
      }
    }
    
    // Extract rating - support "minimum rating:", "X stars", "with X star rating" formats
    const ratingPatterns = [
      /(?:minimum\s+)?rating[:\s]+(\d+\.?\d*)\s*stars?/i,
      /with\s+(\d+\.?\d*)\s+star\s+rating/i,
      /(\d+\.?\d*)\s+star(?:\s+rating)?/i,
      /rating[:\s]+(\d+\.?\d*)/i
    ]
    let rating = null
    for (const pattern of ratingPatterns) {
      const match = query.match(pattern)
      if (match) {
        rating = parseFloat(match[1])
        break
      }
    }
    
    // Extract price filters - support "under X per night", "below X", "less than X", "max X"
    const pricePatterns = [
      /under\s+(\d+(?:,\d{3})*)\s+per\s+night/i,
      /under\s+(\d+(?:,\d{3})*)/i,
      /below\s+(\d+(?:,\d{3})*)\s+per\s+night/i,
      /below\s+(\d+(?:,\d{3})*)/i,
      /less\s+than\s+(\d+(?:,\d{3})*)\s+per\s+night/i,
      /less\s+than\s+(\d+(?:,\d{3})*)/i,
      /max\s+(\d+(?:,\d{3})*)\s+per\s+night/i,
      /max\s+(\d+(?:,\d{3})*)/i,
      /maximum\s+(\d+(?:,\d{3})*)\s+per\s+night/i,
      /maximum\s+(\d+(?:,\d{3})*)/i
    ]
    let priceMax = null
    for (const pattern of pricePatterns) {
      const match = query.match(pattern)
      if (match) {
        // Remove commas and parse as integer
        priceMax = parseInt(match[1].replace(/,/g, ''))
        break
      }
    }
    
    // Enhanced room type matching (including "delux" as variant of "deluxe" and "Room type:" format)
    const roomTypePatterns = [
      /room\s+type[:\s]+([a-zA-Z\s]+?)(?:\.|,|$)/i,
      /(?:the\s+|select\s+|book\s+)?(executive\s+suite|deluxe\s+room|delux\s+room|beachfront\s+villa|ocean\s+view\s+suite|heritage\s+room|mountain\s+view\s+room|business\s+room|garden\s+villa)/i
    ]
    let roomType = null
    for (const pattern of roomTypePatterns) {
      const match = query.match(pattern)
      if (match) {
        roomType = match[1].trim()
    // Normalize "delux" to "deluxe"
    if (roomType && roomType.toLowerCase().includes('delux')) {
      roomType = roomType.replace(/delux/gi, 'deluxe')
        }
        // If it's from "Room type:" format, make sure it matches known room types
        if (roomType && !roomType.match(/^(executive\s+suite|deluxe\s+room|beachfront\s+villa|ocean\s+view\s+suite|heritage\s+room|mountain\s+view\s+room|business\s+room|garden\s+villa)$/i)) {
          // Try to match partial names
          const knownTypes = ['executive suite', 'deluxe room', 'beachfront villa', 'ocean view suite', 'heritage room', 'mountain view room', 'business room', 'garden villa']
          const matchedType = knownTypes.find(type => roomType.toLowerCase().includes(type.toLowerCase()) || type.toLowerCase().includes(roomType.toLowerCase()))
          if (matchedType) {
            roomType = matchedType
          }
        }
        break
      }
    }
    
    // Enhanced guest name extraction - support "for [Name]" pattern and "Guest name:" format
    // Look for names after room type or before email/phone, avoiding "for 2 people" patterns
    // Accept both single names and full names
    
    // First, try "Guest details:" format which contains name, email, phone in one line
    const guestDetailsMatch = query.match(/guest\s+details[:\s]+([^,]+),\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}),\s*([\d\s\+\-\(\)]+)/i)
    let guestName = null
    let email = null
    let phone = null
    
    if (guestDetailsMatch) {
      // Extract from "Guest details:" format
      guestName = guestDetailsMatch[1].trim()
      email = guestDetailsMatch[2]
      phone = guestDetailsMatch[3].replace(/\s+/g, '')
    } else {
      // Extract name, email, phone separately
      const namePatterns = [
        /(?:guest\s+name|guest\s+named|for\s+guest\s+named)[:\s]+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)(?:\s*,|\s+with|\s+email|$)/i,
        /book\s+(?:the|a|an)?\s*[^f]*?\s+for\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)(?:\s*,|\s+email|\s+phone|$)/i,
        /(?:for|guest)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)(?:\s*,|\s+email|\s+phone)(?!\s+(?:people|guests|persons))/i,
        /name[:\s]+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/i
      ]
      for (const pattern of namePatterns) {
        const match = query.match(pattern)
        if (match) {
          const potentialName = match[1].trim()
          // Verify it's a name (not a number, not "people"/"guests", at least 1 word)
          if (potentialName.split(/\s+/).length >= 1 && 
              !potentialName.match(/\d/) && 
              !potentialName.toLowerCase().match(/\b(people|guests|persons)\b/)) {
            guestName = potentialName
            break
          }
        }
      }
      
      // Extract email - support "email:" format
      const emailPatterns = [
        /email[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
        /email\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
      ]
      for (const pattern of emailPatterns) {
        const match = query.match(pattern)
        if (match) {
          email = match[1]
          break
        }
      }
      
      // Extract phone - support "contact:" and "phone:" formats
      const phonePatterns = [
        /(?:contact|phone)[:\s]+(?:number\s+)?([\d\s\+\-\(\)]+)/i,
        /phone\s+(?:number\s+)?([\d\s\+\-\(\)]+)/i
      ]
      for (const pattern of phonePatterns) {
        const match = query.match(pattern)
        if (match) {
          phone = match[1].replace(/\s+/g, '')
          break
        }
      }
    }
    
    return { action, city, checkIn, checkOut, guests, rating, roomType, guestName, email, phone, priceMax }
  }

  const processNaturalLanguageQuery = async () => {
    if (!nlQuery.trim()) {
      setNlStatus('<div style="color: red;">Please enter a booking command</div>')
      return
    }
    
    setNlStatus('<div style="color: blue;">🔄 Processing your request...</div>')
    
    try {
      const params = parseNaturalLanguageQuery(nlQuery)
      
      // Debug: log what was parsed
      console.log('Parsed params:', params)
      
      // Handle search-only queries (don't require dates)
      if (params.action === 'search') {
        if (!params.city) {
          setNlStatus('<div style="color: red;">❌ Please specify a city to search for hotels.</div>')
          return
        }
        
        setNlStatus('<div style="color: blue;">🔍 Searching for hotels...</div>')
        
        // Search hotels
        const searchParams = new URLSearchParams()
        if (params.city) searchParams.append('location', params.city)
        if (params.rating) searchParams.append('rating', params.rating)
        
        const hotelsResponse = await fetch(`${API_BASE}/api/hotels?${searchParams}`)
        const hotelsData = await hotelsResponse.json()
        
        if (!hotelsData.hotels || hotelsData.hotels.length === 0) {
          setNlStatus(`<div style="color: red;">❌ No hotels found in ${params.city}</div>`)
          return
        }
        
        // Update the location filter to show the results
        setLocation(params.city)
        if (params.rating) setRating(params.rating)
        if (params.priceMax) setPriceMax(params.priceMax)
        
        setNlStatus(`
          <div style="background: var(--primary-color); color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <h3 style="margin: 0 0 0.5rem 0;">✅ Found ${hotelsData.hotels.length} hotel(s) in ${params.city}</h3>
            <p style="margin: 0.5rem 0; font-size: 0.9rem;">Scrolling to hotels...</p>
          </div>
        `)
        
        setNlQuery('')
        
        // Scroll to hotels section after a short delay to allow state update
        setTimeout(() => {
          const hotelsSection = document.querySelector('.hotels-section')
          if (hotelsSection) {
            hotelsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        
        return
      }
      
      // For booking actions, require dates
      if (!params.city || !params.checkIn || !params.checkOut) {
        const missing = []
        if (!params.city) missing.push('city')
        if (!params.checkIn) missing.push('check-in date')
        if (!params.checkOut) missing.push('check-out date')
        setNlStatus(`<div style="color: red;">❌ Missing required information: ${missing.join(', ')}. Please include city, check-in, and check-out dates.</div>`)
        return
      }
      
      setNlStatus('<div style="color: blue;">🔍 Searching for hotels...</div>')
      
      // Search hotels
      const searchParams = new URLSearchParams()
      if (params.city) searchParams.append('location', params.city)
      if (params.rating) searchParams.append('rating', params.rating)
      
      const hotelsResponse = await fetch(`${API_BASE}/api/hotels?${searchParams}`)
      const hotelsData = await hotelsResponse.json()
      
      if (!hotelsData.hotels || hotelsData.hotels.length === 0) {
        setNlStatus('<div style="color: red;">❌ No hotels found matching your criteria</div>')
        return
      }
      
      // Get first hotel details
      const firstHotel = hotelsData.hotels[0]
      const hotelDetailsResponse = await fetch(`${API_BASE}/api/hotels/${firstHotel.id}`)
      const firstHotelDetails = await hotelDetailsResponse.json()
      
      // Handle different actions
      if (params.action === 'show_rooms') {
        // Action 1: Show room types available in first hotel
        setNlStatus('<div style="color: blue;">🏨 Loading hotel details...</div>')
        
        setSelectedHotel(firstHotelDetails)
        setShowHotelModal(true)
        
        setNlStatus(`
          <div style="background: var(--primary-color); color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <h3 style="margin: 0 0 0.5rem 0;">✅ Hotel Details Opened</h3>
            <p style="margin: 0.5rem 0;"><strong>Hotel:</strong> ${firstHotelDetails.name}</p>
            <p style="margin: 0.5rem 0;"><strong>Available Rooms:</strong> ${firstHotelDetails.rooms?.length || 0}</p>
            <p style="margin: 0.5rem 0; font-size: 0.9rem;">Check the modal to see all available room types.</p>
          </div>
        `)
        
        setNlQuery('')
        return
      }
      
      if (params.action === 'select_room') {
        // Action 2: Select room and take user to booking form
        setNlStatus('<div style="color: blue;">🏨 Finding matching room...</div>')
        
        if (!params.roomType) {
          setNlStatus('<div style="color: red;">❌ Please specify a room type to select</div>')
          return
        }
        
        // Find matching room
        const matchingRoom = firstHotelDetails.rooms.find(room => {
          const roomTypeLower = room.type.toLowerCase()
          const searchTypeLower = params.roomType.toLowerCase()
          return roomTypeLower.includes(searchTypeLower) || searchTypeLower.includes(roomTypeLower)
        })
        
        if (!matchingRoom) {
          setNlStatus(`<div style="color: red;">❌ Room type "${params.roomType}" not found. Available rooms: ${firstHotelDetails.rooms.map(r => r.type).join(', ')}</div>`)
          return
        }
        
        if (matchingRoom.maxGuests < params.guests) {
          setNlStatus(`<div style="color: red;">❌ Selected room can only accommodate ${matchingRoom.maxGuests} guests, but you requested ${params.guests} guests.</div>`)
          return
        }
        
        // Create checkout session and open booking form
        setNlStatus('<div style="color: blue;">💳 Creating booking session...</div>')
        
        const checkoutResponse = await fetch(`${API_BASE}/api/checkout-sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hotelId: firstHotelDetails.id,
            roomId: matchingRoom.id,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            guests: params.guests,
            currency: 'IDR'
          })
        })
        
        if (!checkoutResponse.ok) {
          throw new Error('Failed to create checkout session')
        }
        
        const session = await checkoutResponse.json()
        setCheckoutSession(session)
        setSelectedHotel(firstHotelDetails)
        setShowBookingModal(true)
        
        // Update search form dates
        setCheckIn(params.checkIn)
        setCheckOut(params.checkOut)
        setGuests(params.guests)
        
        setNlStatus(`
          <div style="background: var(--success-color); color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <h3 style="margin: 0 0 0.5rem 0;">✅ Booking Form Opened</h3>
            <p style="margin: 0.5rem 0;"><strong>Hotel:</strong> ${firstHotelDetails.name}</p>
            <p style="margin: 0.5rem 0;"><strong>Room:</strong> ${matchingRoom.type}</p>
            <p style="margin: 0.5rem 0; font-size: 0.9rem;">Please complete the booking form in the modal.</p>
          </div>
        `)
        
        setNlQuery('')
        return
      }
      
      // Action 3: Complete booking (original flow)
      setNlStatus('<div style="color: blue;">🏨 Finding matching hotel and room...</div>')
      
      let selectedHotel = null
      let selectedRoom = null
      
      for (const hotel of hotelsData.hotels) {
        const hotelDetailsResponse = await fetch(`${API_BASE}/api/hotels/${hotel.id}`)
        const hotelDetails = await hotelDetailsResponse.json()
        
        const matchingRoom = hotelDetails.rooms.find(room => {
          if (!params.roomType) return true
          const roomTypeLower = room.type.toLowerCase()
          const searchTypeLower = params.roomType.toLowerCase()
          return roomTypeLower.includes(searchTypeLower) || searchTypeLower.includes(roomTypeLower)
        })
        
        if (matchingRoom && matchingRoom.maxGuests >= params.guests) {
          selectedHotel = hotelDetails
          selectedRoom = matchingRoom
          break
        }
      }
      
      if (!selectedHotel || !selectedRoom) {
        selectedHotel = firstHotelDetails
        selectedRoom = firstHotelDetails.rooms[0]
      }
      
      // Create checkout session
      setNlStatus('<div style="color: blue;">💳 Creating booking...</div>')
      
      const checkoutResponse = await fetch(`${API_BASE}/api/checkout-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          roomId: selectedRoom.id,
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          guests: params.guests,
          currency: 'IDR'
        })
      })
      
      if (!checkoutResponse.ok) {
        throw new Error('Failed to create checkout session')
      }
      
      const session = await checkoutResponse.json()
      
      // Complete booking
      setNlStatus('<div style="color: blue;">✅ Completing booking...</div>')
      
      const completeResponse = await fetch(`${API_BASE}/api/checkout-sessions/${session.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: {
            full_name: params.guestName || 'Guest',
            email: params.email || 'guest@example.com',
            phone: params.phone || '0000000000'
          },
          payment: {
            method: 'credit_card',
            token: 'success_token'
          }
        })
      })
      
      if (!completeResponse.ok) {
        throw new Error('Failed to complete booking')
      }
      
      const booking = await completeResponse.json()
      const total = booking.totals.find(t => t.type === 'total')?.amount || 0
      
      setNlStatus(`
        <div style="background: #28A745; color: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
          <h3 style="margin: 0 0 0.5rem 0;">🎉 Booking Confirmed!</h3>
          <p style="margin: 0.5rem 0;"><strong>Hotel:</strong> ${booking.hotel.name}</p>
          <p style="margin: 0.5rem 0;"><strong>Room:</strong> ${booking.room.type}</p>
          <p style="margin: 0.5rem 0;"><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
          <p style="margin: 0.5rem 0;"><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
          <p style="margin: 0.5rem 0;"><strong>Guests:</strong> ${booking.guests}</p>
          <p style="margin: 0.5rem 0;"><strong>Total:</strong> ${formatCurrency(total)}</p>
          <p style="margin: 0.5rem 0; font-size: 1.1rem;"><strong>Confirmation:</strong> ${booking.confirmationNumber}</p>
        </div>
      `)
      
      setNlQuery('')
      loadHotels()
    } catch (error) {
      console.error('Error processing natural language query:', error)
      setNlStatus(`<div style="color: red;">❌ Error: ${error.message}</div>`)
    }
  }

  return (
    <main>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>🏨 HotelBooking</h1>
            </div>
            <nav className="nav">
              <a href="#" className="nav-link active">Hotels</a>
              <a href="#" className="nav-link">My Bookings</a>
              <a href="#" className="nav-link">Help</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Natural Language Search */}
      <section className="nl-search-section">
        <div className="container">
          <div className="nl-search-box">
            <div className="nl-search-header">
              <h3>🤖 AI-Powered Booking</h3>
              <p>
                <strong>Try these commands:</strong><br />
                1. &quot;book a hotel in Jakarta checkin 2026-01-15 checkout 2026-01-16 for 2 guests with 4.5 star rating. book the executive suite for guest named vipul with email guest@m.com and phone number 9009900900&quot;<br />
                2. &quot;search a hotel in Jakarta checkin 2026-01-15 checkout 2026-01-16 for 2 guests with 4.5 star rating. show the room types available in first hotel&quot;<br />
                3. &quot;search a hotel in Jakarta checkin 2026-01-15 checkout 2026-01-16 for 2 guests with 4.5 star rating. select delux room and take the user to form page&quot;
              </p>
            </div>
            <div className="nl-search-input-wrapper">
              <input
                type="text"
                className="nl-search-input"
                placeholder="Tell me what you need..."
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && processNaturalLanguageQuery()}
              />
              <button className="btn-nl-search" onClick={processNaturalLanguageQuery}>
                <span>🚀 Book Now</span>
              </button>
            </div>
            <div className="nl-search-status" dangerouslySetInnerHTML={{ __html: nlStatus }} />
          </div>
        </div>
      </section>

      {/* Hero Search Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">Find Your Perfect Stay</h2>
            <p className="hero-subtitle">Book hotels with ease using Universal Commerce Protocol</p>
            
            <div className="search-box">
              <div className="search-row">
                <div className="search-field">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="search-field">
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="search-field">
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                <div className="search-field">
                  <label>Guests</label>
                  <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>
                <button className="btn-search" onClick={searchHotels}>Search</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <div className="container">
          <div className="filter-row">
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  value={priceMin}
                  step="100000"
                  onChange={(e) => setPriceMin(parseInt(e.target.value))}
                />
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  value={priceMax}
                  step="100000"
                  onChange={(e) => setPriceMax(parseInt(e.target.value))}
                />
                <div className="price-display">
                  {formatCurrency(priceMin)} - {formatCurrency(priceMax)}
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label>Rating</label>
              <div className="rating-filter">
                <button
                  className={`rating-btn ${rating === 4.5 ? 'active' : ''}`}
                  onClick={() => setRating(rating === 4.5 ? 0 : 4.5)}
                >
                  4.5+ ⭐
                </button>
                <button
                  className={`rating-btn ${rating === 4.0 ? 'active' : ''}`}
                  onClick={() => setRating(rating === 4.0 ? 0 : 4.0)}
                >
                  4.0+ ⭐
                </button>
                <button
                  className={`rating-btn ${rating === 0 ? 'active' : ''}`}
                  onClick={() => setRating(0)}
                >
                  All
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels List */}
      <section className="hotels-section">
        <div className="container">
          <div className="section-header">
            <h2>Available Hotels</h2>
            <p className="hotelCount">{filteredHotels.length} hotels found</p>
          </div>
          <div className="hotels-grid">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card" onClick={() => showHotelDetails(hotel.id)}>
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="hotel-image"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(hotel.name)}`
                  }}
                />
                <div className="hotel-content">
                  <div className="hotel-header">
                    <div>
                      <h3 className="hotel-name">{hotel.name}</h3>
                      <div className="hotel-location">📍 {hotel.location}</div>
                    </div>
                    <div className="hotel-rating">{hotel.rating} ⭐</div>
                  </div>
                  <div className="hotel-amenities">
                    {hotel.amenities?.slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">{amenity}</span>
                    )) || []}
                  </div>
                  <div className="hotel-footer">
                    <div className="hotel-price">
                      <span className="price-label">per night</span>
                      <span className="price-amount">{formatCurrency(hotel.pricePerNight)}</span>
                    </div>
                    <button
                      className="btn-book"
                      onClick={(e) => {
                        e.stopPropagation()
                        showHotelDetails(hotel.id)
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Details Modal */}
      {showHotelModal && selectedHotel && selectedHotel.rooms && (
        <div className="modal show" onClick={() => setShowHotelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowHotelModal(false)}>&times;</span>
            <div className="hotel-details">
              <div className="hotel-details-header">
                <div className="hotel-details-images">
                  <img
                    src={selectedHotel.images?.[0] || selectedHotel.image}
                    alt={selectedHotel.name}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/600x400?text=${encodeURIComponent(selectedHotel.name)}`
                    }}
                  />
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {(selectedHotel.images?.slice(1, 3) || []).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={selectedHotel.name}
                        style={{ height: 'calc(50% - 0.25rem)', objectFit: 'cover', borderRadius: '8px' }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ))}
                  </div>
                </div>
                <div className="hotel-details-info">
                  <h1>{selectedHotel.name}</h1>
                  <div className="location">📍 {selectedHotel.location}</div>
                  <div className="rating">{selectedHotel.rating} ⭐ ({selectedHotel.reviewCount} reviews)</div>
                  <p style={{ marginTop: '1rem', color: 'var(--text-gray)' }}>{selectedHotel.description}</p>
                  <div className="hotel-amenities" style={{ marginTop: '1rem' }}>
                    {(selectedHotel.amenities || []).map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="rooms-list">
                <h2 style={{ marginBottom: '1rem' }}>Available Rooms</h2>
                {selectedHotel.rooms?.map((room) => (
                  <div key={room.id} className="room-card">
                    <div className="room-info">
                      <h3>{room.type}</h3>
                      <p>{room.description}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-gray)' }}>
                        Max Guests: {room.maxGuests} | {(room.amenities || []).slice(0, 3).join(', ')}
                      </p>
                    </div>
                    <div className="room-price">
                      <div className="price">{formatCurrency(room.pricePerNight)}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-gray)' }}>per night</div>
                      <button
                        className="btn-book"
                        style={{ marginTop: '0.5rem' }}
                        onClick={() => startBooking(selectedHotel.id, room.id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && checkoutSession && !bookingConfirmed && (
        <div className="modal show" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowBookingModal(false)}>&times;</span>
            <h2 style={{ marginBottom: '1.5rem' }}>Complete Your Booking</h2>
            
            <div className="booking-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  required
                />
              </div>
              
              <div className="booking-summary">
                <h3 style={{ marginBottom: '1rem' }}>Booking Summary</h3>
                {selectedHotel && checkoutSession.line_items?.[0] && (
                  <>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>{selectedHotel.name}</strong><br />
                      <span style={{ color: 'var(--text-gray)', fontSize: '0.875rem' }}>
                        {checkoutSession.line_items[0].item.room?.type} | {' '}
                        {checkoutSession.line_items[0].item.nights} night(s) | {' '}
                        {checkoutSession.line_items[0].item.guests} guest(s)
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Check-in:</span>
                      <span>{formatDate(checkoutSession.line_items[0].item.checkIn)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Check-out:</span>
                      <span>{formatDate(checkoutSession.line_items[0].item.checkOut)}</span>
                    </div>
                    {checkoutSession.totals?.map((total, idx) => {
                      if (total.type === 'subtotal') {
                        return (
                          <div key={idx} className="summary-row">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(total.amount)}</span>
                          </div>
                        )
                      }
                      if (total.type === 'discount') {
                        return (
                          <div key={idx} className="summary-row">
                            <span>Discount:</span>
                            <span style={{ color: 'var(--success-color)' }}>
                              -{formatCurrency(total.amount)}
                            </span>
                          </div>
                        )
                      }
                      if (total.type === 'total') {
                        return (
                          <div key={idx} className="summary-row total">
                            <span>Total:</span>
                            <span>{formatCurrency(total.amount)}</span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </>
                )}
              </div>
              
              <div className="discount-section">
                <label>Discount Code (Optional)</label>
                <div className="discount-input">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && applyDiscount()}
                  />
                  <button className="btn-apply-discount" onClick={applyDiscount}>
                    Apply
                  </button>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>
                  Try: WELCOME10, SUMMER20, or EARLYBIRD15
                </div>
              </div>
              
              <button className="btn-complete" onClick={completeBooking}>
                Complete Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingModal && bookingConfirmed && (
        <div className="modal show" onClick={() => {
          setShowBookingModal(false)
          setBookingConfirmed(null)
          setCheckoutSession(null)
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => {
              setShowBookingModal(false)
              setBookingConfirmed(null)
              setCheckoutSession(null)
            }}>&times;</span>
            
            <div className="success-message">
              <h2>🎉 Booking Confirmed!</h2>
              <p>Your hotel reservation has been successfully completed.</p>
              <div className="confirmation-number">
                Confirmation: {bookingConfirmed.confirmationNumber}
              </div>
            </div>
            
            <div className="booking-summary">
              <h3 style={{ marginBottom: '1rem' }}>Booking Details</h3>
              <div className="summary-row">
                <span>Hotel:</span>
                <span><strong>{bookingConfirmed.hotel?.name}</strong></span>
              </div>
              <div className="summary-row">
                <span>Room:</span>
                <span>{bookingConfirmed.room?.type}</span>
              </div>
              <div className="summary-row">
                <span>Check-in:</span>
                <span>{formatDate(bookingConfirmed.checkIn)}</span>
              </div>
              <div className="summary-row">
                <span>Check-out:</span>
                <span>{formatDate(bookingConfirmed.checkOut)}</span>
              </div>
              <div className="summary-row">
                <span>Guests:</span>
                <span>{bookingConfirmed.guests}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span><strong>
                  {formatCurrency(bookingConfirmed.totals?.find(t => t.type === 'total')?.amount || 0)}
                </strong></span>
              </div>
            </div>
            
            <button
              className="btn-complete"
              style={{ background: 'var(--primary-color)' }}
              onClick={() => {
                setShowBookingModal(false)
                setBookingConfirmed(null)
                setCheckoutSession(null)
                loadHotels()
              }}
            >
              Book Another Hotel
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
