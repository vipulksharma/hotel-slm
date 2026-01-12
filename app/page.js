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

  // Natural Language Processing functions (simplified - full version would be in a separate file)
  const parseNaturalLanguageQuery = (query) => {
    const lowerQuery = query.toLowerCase()
    
    // Detect action type
    let action = 'book' // default: complete booking
    if (lowerQuery.includes('show') && (lowerQuery.includes('room') || lowerQuery.includes('room types'))) {
      action = 'show_rooms'
    } else if (lowerQuery.includes('select') && lowerQuery.includes('room') && (lowerQuery.includes('form') || lowerQuery.includes('booking'))) {
      action = 'select_room'
    } else if (lowerQuery.includes('book') && (lowerQuery.includes('guest named') || lowerQuery.includes('email'))) {
      action = 'book'
    }
    
    const cityMatch = query.match(/(?:in|at)\s+([a-zA-Z\s]+?)(?:\s+checkin|\s+check-in|\s+checkout|\s+check-out|\s+for|$)/i)
    const city = cityMatch ? cityMatch[1].trim() : null
    
    const checkInMatch = query.match(/(?:checkin|check-in)\s+(\d{4}-\d{2}-\d{2})/i)
    const checkIn = checkInMatch ? checkInMatch[1] : null
    
    const checkOutMatch = query.match(/(?:checkout|check-out)\s+(\d{4}-\d{2}-\d{2})/i)
    const checkOut = checkOutMatch ? checkOutMatch[1] : null
    
    const guestsMatch = query.match(/(?:for\s+)?(\d+)\s+guests?/i)
    const guests = guestsMatch ? parseInt(guestsMatch[1]) : 2
    
    const ratingMatch = query.match(/(\d+\.?\d*)\s+star/i)
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null
    
    // Enhanced room type matching (including "delux" as variant of "deluxe")
    const roomTypeMatch = query.match(/(?:the\s+|select\s+)?(executive\s+suite|deluxe\s+room|delux\s+room|beachfront\s+villa|ocean\s+view\s+suite|heritage\s+room|mountain\s+view\s+room|business\s+room|garden\s+villa)/i)
    let roomType = roomTypeMatch ? roomTypeMatch[1].trim() : null
    // Normalize "delux" to "deluxe"
    if (roomType && roomType.toLowerCase().includes('delux')) {
      roomType = roomType.replace(/delux/gi, 'deluxe')
    }
    
    const nameMatch = query.match(/(?:guest\s+named|for\s+guest\s+named)\s+([a-zA-Z\s]+?)(?:\s+with|\s+email|$)/i)
    const guestName = nameMatch ? nameMatch[1].trim() : null
    
    const emailMatch = query.match(/email\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
    const email = emailMatch ? emailMatch[1] : null
    
    const phoneMatch = query.match(/phone\s+(?:number\s+)?([\d\s\+\-\(\)]+)/i)
    const phone = phoneMatch ? phoneMatch[1].replace(/\s+/g, '') : null
    
    return { action, city, checkIn, checkOut, guests, rating, roomType, guestName, email, phone }
  }

  const processNaturalLanguageQuery = async () => {
    if (!nlQuery.trim()) {
      setNlStatus('<div style="color: red;">Please enter a booking command</div>')
      return
    }
    
    setNlStatus('<div style="color: blue;">🔄 Processing your request...</div>')
    
    try {
      const params = parseNaturalLanguageQuery(nlQuery)
      
      if (!params.city || !params.checkIn || !params.checkOut) {
        setNlStatus('<div style="color: red;">❌ Missing required information. Please include city, check-in, and check-out dates.</div>')
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
