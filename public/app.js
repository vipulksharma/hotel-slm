// API Base URL
const API_BASE = 'http://localhost:3000';

// Global state
let currentHotels = [];
let selectedHotel = null;
let selectedRoom = null;
let checkoutSession = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    document.getElementById('checkInInput').value = today.toISOString().split('T')[0];
    document.getElementById('checkOutInput').value = tomorrow.toISOString().split('T')[0];
    
    // Load all hotels on page load
    loadHotels();
    
    // Setup price range filters
    setupPriceFilters();
    
    // Setup rating filters
    setupRatingFilters();
});

// Setup price range filters
function setupPriceFilters() {
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceMinDisplay = document.getElementById('priceMinDisplay');
    const priceMaxDisplay = document.getElementById('priceMaxDisplay');
    
    priceMin.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        priceMinDisplay.textContent = formatCurrency(value);
        if (value > parseInt(priceMax.value)) {
            priceMax.value = value;
            priceMaxDisplay.textContent = formatCurrency(value);
        }
        filterHotels();
    });
    
    priceMax.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        priceMaxDisplay.textContent = formatCurrency(value);
        if (value < parseInt(priceMin.value)) {
            priceMin.value = value;
            priceMinDisplay.textContent = formatCurrency(value);
        }
        filterHotels();
    });
}

// Setup rating filters
function setupRatingFilters() {
    const ratingButtons = document.querySelectorAll('.rating-btn');
    ratingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            ratingButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterHotels();
        });
    });
}

// Load hotels from API
async function loadHotels() {
    try {
        const response = await fetch(`${API_BASE}/api/hotels`);
        const data = await response.json();
        currentHotels = data.hotels;
        displayHotels(currentHotels);
        updateHotelCount(currentHotels.length);
    } catch (error) {
        console.error('Error loading hotels:', error);
        document.getElementById('hotelsList').innerHTML = 
            '<div class="loading">Error loading hotels. Please try again.</div>';
    }
}

// Search hotels
async function searchHotels() {
    const location = document.getElementById('locationInput').value;
    const checkIn = document.getElementById('checkInInput').value;
    const checkOut = document.getElementById('checkOutInput').value;
    const guests = document.getElementById('guestsInput').value;
    
    try {
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        
        const response = await fetch(`${API_BASE}/api/hotels?${params}`);
        const data = await response.json();
        currentHotels = data.hotels;
        displayHotels(currentHotels);
        updateHotelCount(currentHotels.length);
    } catch (error) {
        console.error('Error searching hotels:', error);
    }
}

// Filter hotels
function filterHotels() {
    const priceMin = parseInt(document.getElementById('priceMin').value);
    const priceMax = parseInt(document.getElementById('priceMax').value);
    const activeRatingBtn = document.querySelector('.rating-btn.active');
    const minRating = activeRatingBtn ? parseFloat(activeRatingBtn.dataset.rating) : 0;
    
    let filtered = currentHotels.filter(hotel => {
        if (hotel.pricePerNight < priceMin || hotel.pricePerNight > priceMax) {
            return false;
        }
        if (hotel.rating < minRating) {
            return false;
        }
        return true;
    });
    
    displayHotels(filtered);
    updateHotelCount(filtered.length);
}

// Display hotels
function displayHotels(hotels) {
    const hotelsList = document.getElementById('hotelsList');
    
    if (hotels.length === 0) {
        hotelsList.innerHTML = '<div class="loading">No hotels found matching your criteria.</div>';
        return;
    }
    
    hotelsList.innerHTML = hotels.map(hotel => `
        <div class="hotel-card" onclick="showHotelDetails('${hotel.id}')">
            <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image" 
                 onerror="this.src='https://via.placeholder.com/400x200?text=${encodeURIComponent(hotel.name)}'">
            <div class="hotel-content">
                <div class="hotel-header">
                    <div>
                        <h3 class="hotel-name">${hotel.name}</h3>
                        <div class="hotel-location">📍 ${hotel.location}</div>
                    </div>
                    <div class="hotel-rating">${hotel.rating} ⭐</div>
                </div>
                <div class="hotel-amenities">
                    ${hotel.amenities.slice(0, 4).map(amenity => 
                        `<span class="amenity-tag">${amenity}</span>`
                    ).join('')}
                </div>
                <div class="hotel-footer">
                    <div class="hotel-price">
                        <span class="price-label">per night</span>
                        <span class="price-amount">${formatCurrency(hotel.pricePerNight)}</span>
                    </div>
                    <button class="btn-book" onclick="event.stopPropagation(); showHotelDetails('${hotel.id}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show hotel details
async function showHotelDetails(hotelId) {
    try {
        const response = await fetch(`${API_BASE}/api/hotels/${hotelId}`);
        const hotel = await response.json();
        selectedHotel = hotel;
        
        const modal = document.getElementById('hotelModal');
        const detailsDiv = document.getElementById('hotelDetails');
        
        detailsDiv.innerHTML = `
            <div class="hotel-details">
                <div class="hotel-details-header">
                    <div class="hotel-details-images">
                        <img src="${hotel.images[0] || hotel.image}" alt="${hotel.name}" 
                             onerror="this.src='https://via.placeholder.com/600x400?text=${encodeURIComponent(hotel.name)}'">
                        <div style="display: grid; gap: 0.5rem;">
                            ${hotel.images.slice(1, 3).map(img => 
                                `<img src="${img}" alt="${hotel.name}" style="height: calc(50% - 0.25rem); object-fit: cover; border-radius: 8px;" 
                                      onerror="this.style.display='none'">`
                            ).join('')}
                        </div>
                    </div>
                    <div class="hotel-details-info">
                        <h1>${hotel.name}</h1>
                        <div class="location">📍 ${hotel.location}</div>
                        <div class="rating">${hotel.rating} ⭐ (${hotel.reviewCount} reviews)</div>
                        <p style="margin-top: 1rem; color: var(--text-gray);">${hotel.description}</p>
                        <div class="hotel-amenities" style="margin-top: 1rem;">
                            ${hotel.amenities.map(amenity => 
                                `<span class="amenity-tag">${amenity}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="rooms-list">
                    <h2 style="margin-bottom: 1rem;">Available Rooms</h2>
                    ${hotel.rooms.map(room => `
                        <div class="room-card">
                            <div class="room-info">
                                <h3>${room.type}</h3>
                                <p>${room.description}</p>
                                <p style="font-size: 0.875rem; color: var(--text-gray);">
                                    Max Guests: ${room.maxGuests} | 
                                    ${room.amenities.slice(0, 3).join(', ')}
                                </p>
                            </div>
                            <div class="room-price">
                                <div class="price">${formatCurrency(room.pricePerNight)}</div>
                                <div style="font-size: 0.875rem; color: var(--text-gray);">per night</div>
                                <button class="btn-book" style="margin-top: 0.5rem;" 
                                        onclick="startBooking('${hotel.id}', '${room.id}')">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading hotel details:', error);
        alert('Error loading hotel details');
    }
}

// Start booking process
async function startBooking(hotelId, roomId) {
    closeModal();
    
    const checkIn = document.getElementById('checkInInput').value;
    const checkOut = document.getElementById('checkOutInput').value;
    const guests = document.getElementById('guestsInput').value;
    
    if (!checkIn || !checkOut) {
        alert('Please select check-in and check-out dates');
        return;
    }
    
    try {
        // Ensure we have hotel details with rooms
        if (!selectedHotel || !selectedHotel.rooms) {
            const hotelResponse = await fetch(`${API_BASE}/api/hotels/${hotelId}`);
            selectedHotel = await hotelResponse.json();
        }
        
        // Find the selected room
        selectedRoom = selectedHotel.rooms.find(r => r.id === roomId);
        
        if (!selectedRoom) {
            alert('Room not found');
            return;
        }
        
        // Create checkout session
        const response = await fetch(`${API_BASE}/checkout-sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hotelId,
                roomId,
                checkIn,
                checkOut,
                guests: parseInt(guests),
                currency: 'IDR'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create checkout session');
        }
        
        checkoutSession = await response.json();
        showBookingModal();
    } catch (error) {
        console.error('Error creating checkout session:', error);
        alert('Error starting booking process: ' + error.message);
    }
}

// Show booking modal
function showBookingModal() {
    const modal = document.getElementById('bookingModal');
    const detailsDiv = document.getElementById('bookingDetails');
    
    const nights = calculateNights(checkoutSession.line_items[0].item.checkIn, 
                                   checkoutSession.line_items[0].item.checkOut);
    const subtotal = checkoutSession.totals.find(t => t.type === 'subtotal')?.amount || 0;
    const discount = checkoutSession.totals.find(t => t.type === 'discount')?.amount || 0;
    const total = checkoutSession.totals.find(t => t.type === 'total')?.amount || 0;
    
    detailsDiv.innerHTML = `
        <h2 style="margin-bottom: 1.5rem;">Complete Your Booking</h2>
        
        <div class="booking-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="buyerName" placeholder="John Doe" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="buyerEmail" placeholder="john.doe@example.com" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="buyerPhone" placeholder="+62 812 3456 7890" required>
            </div>
            
            <div class="booking-summary">
                <h3 style="margin-bottom: 1rem;">Booking Summary</h3>
                <div style="margin-bottom: 0.5rem;">
                    <strong>${selectedHotel.name}</strong><br>
                    <span style="color: var(--text-gray); font-size: 0.875rem;">
                        ${selectedRoom.type} | ${nights} night(s) | ${checkoutSession.line_items[0].item.guests} guest(s)
                    </span>
                </div>
                <div class="summary-row">
                    <span>Check-in:</span>
                    <span>${formatDate(checkoutSession.line_items[0].item.checkIn)}</span>
                </div>
                <div class="summary-row">
                    <span>Check-out:</span>
                    <span>${formatDate(checkoutSession.line_items[0].item.checkOut)}</span>
                </div>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                ${discount > 0 ? `
                    <div class="summary-row">
                        <span>Discount:</span>
                        <span style="color: var(--success-color);">-${formatCurrency(discount)}</span>
                    </div>
                ` : ''}
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>${formatCurrency(total)}</span>
                </div>
            </div>
            
            <div class="discount-section">
                <label>Discount Code (Optional)</label>
                <div class="discount-input">
                    <input type="text" id="discountCode" placeholder="Enter code">
                    <button class="btn-apply-discount" onclick="applyDiscount()">Apply</button>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-gray);">
                    Try: WELCOME10, SUMMER20, or EARLYBIRD15
                </div>
            </div>
            
            <button class="btn-complete" onclick="completeBooking()">Complete Booking</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Apply discount
async function applyDiscount() {
    const code = document.getElementById('discountCode').value.trim().toUpperCase();
    
    if (!code) {
        alert('Please enter a discount code');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/checkout-sessions/${checkoutSession.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...checkoutSession,
                discounts: {
                    codes: [code]
                }
            })
        });
        
        checkoutSession = await response.json();
        showBookingModal(); // Refresh modal with updated prices
    } catch (error) {
        console.error('Error applying discount:', error);
        alert('Invalid discount code');
    }
}

// Complete booking
async function completeBooking() {
    const name = document.getElementById('buyerName').value;
    const email = document.getElementById('buyerEmail').value;
    const phone = document.getElementById('buyerPhone').value;
    
    if (!name || !email || !phone) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/checkout-sessions/${checkoutSession.id}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                buyer: {
                    full_name: name,
                    email: email,
                    phone: phone
                },
                payment: {
                    method: 'credit_card',
                    token: 'success_token'
                }
            })
        });
        
        const booking = await response.json();
        showBookingConfirmation(booking);
    } catch (error) {
        console.error('Error completing booking:', error);
        alert('Error completing booking. Please try again.');
    }
}

// Show booking confirmation
function showBookingConfirmation(booking) {
    const detailsDiv = document.getElementById('bookingDetails');
    
    detailsDiv.innerHTML = `
        <div class="success-message">
            <h2>🎉 Booking Confirmed!</h2>
            <p>Your hotel reservation has been successfully completed.</p>
            <div class="confirmation-number">
                Confirmation: ${booking.confirmationNumber}
            </div>
        </div>
        
        <div class="booking-summary">
            <h3 style="margin-bottom: 1rem;">Booking Details</h3>
            <div class="summary-row">
                <span>Hotel:</span>
                <span><strong>${booking.hotel.name}</strong></span>
            </div>
            <div class="summary-row">
                <span>Room:</span>
                <span>${booking.room.type}</span>
            </div>
            <div class="summary-row">
                <span>Check-in:</span>
                <span>${formatDate(booking.checkIn)}</span>
            </div>
            <div class="summary-row">
                <span>Check-out:</span>
                <span>${formatDate(booking.checkOut)}</span>
            </div>
            <div class="summary-row">
                <span>Guests:</span>
                <span>${booking.guests}</span>
            </div>
            <div class="summary-row">
                <span>Total:</span>
                <span><strong>${formatCurrency(booking.totals.find(t => t.type === 'total').amount)}</strong></span>
            </div>
        </div>
        
        <button class="btn-complete" onclick="closeBookingModal(); loadHotels();" style="background: var(--primary-color);">
            Book Another Hotel
        </button>
    `;
}

// Close modals
function closeModal() {
    document.getElementById('hotelModal').style.display = 'none';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    checkoutSession = null;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const hotelModal = document.getElementById('hotelModal');
    const bookingModal = document.getElementById('bookingModal');
    if (event.target === hotelModal) {
        closeModal();
    }
    if (event.target === bookingModal) {
        closeBookingModal();
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
}

function updateHotelCount(count) {
    document.getElementById('hotelCount').textContent = `${count} hotels found`;
}

// Natural Language Query Processing
async function processNaturalLanguageQuery() {
    const query = document.getElementById('nlSearchInput').value.trim();
    const statusDiv = document.getElementById('nlSearchStatus');
    
    if (!query) {
        statusDiv.innerHTML = '<div style="color: red;">Please enter a booking command</div>';
        return;
    }
    
    statusDiv.innerHTML = '<div style="color: blue;">🔄 Processing your request...</div>';
    
    try {
        // Parse the natural language query using SLM/pattern matching
        const params = parseNaturalLanguageQuery(query);
        
        if (!params.city || !params.checkIn || !params.checkOut) {
            statusDiv.innerHTML = '<div style="color: red;">❌ Missing required information. Please include city, check-in, and check-out dates.</div>';
            return;
        }
        
        statusDiv.innerHTML = '<div style="color: blue;">🔍 Searching for hotels...</div>';
        
        // Execute the complete booking flow
        await executeNaturalLanguageBooking(params);
        
    } catch (error) {
        console.error('Error processing natural language query:', error);
        statusDiv.innerHTML = `<div style="color: red;">❌ Error: ${error.message}</div>`;
    }
}

// Parse natural language query using pattern matching
// NOTE: This can be replaced with an LLM API call for better understanding
// Example LLM integration:
// async function parseNaturalLanguageQueryWithLLM(query) {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer YOUR_API_KEY'
//         },
//         body: JSON.stringify({
//             model: 'gpt-4',
//             messages: [{
//                 role: 'system',
//                 content: 'Extract booking parameters from user query. Return JSON with: city, checkIn (YYYY-MM-DD), checkOut (YYYY-MM-DD), guests (number), rating (number), roomType (string), guestName (string), email (string), phone (string)'
//             }, {
//                 role: 'user',
//                 content: query
//             }]
//         })
//     });
//     const data = await response.json();
//     return JSON.parse(data.choices[0].message.content);
// }
function parseNaturalLanguageQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Extract city - look for "in [city]" or "hotel in [city]" or "book a hotel in [city]"
    const cityPatterns = [
        /(?:in|at)\s+([a-zA-Z\s]+?)(?:\s+checkin|\s+check-in|\s+checkout|\s+check-out|\s+for|\s+with|$)/i,
        /book\s+(?:a\s+)?hotel\s+in\s+([a-zA-Z\s]+?)(?:\s+checkin|\s+check-in|\s+checkout|\s+check-out|\s+for|$)/i
    ];
    let city = null;
    for (const pattern of cityPatterns) {
        const match = query.match(pattern);
        if (match) {
            city = match[1].trim();
            break;
        }
    }
    
    // Extract check-in date - look for "checkin" or "check-in" followed by date
    const checkInPatterns = [
        /(?:checkin|check-in|check\s+in)\s+(\d{4}-\d{2}-\d{2})/i,
        /(?:checkin|check-in|check\s+in)\s+(\d{2}\/\d{2}\/\d{4})/i,
        /(?:checkin|check-in|check\s+in)\s+(\d{2}-\d{2}-\d{4})/i
    ];
    let checkIn = null;
    for (const pattern of checkInPatterns) {
        const match = query.match(pattern);
        if (match) {
            checkIn = normalizeDate(match[1]);
            break;
        }
    }
    
    // Extract check-out date - look for "checkout" or "check-out" followed by date
    const checkOutPatterns = [
        /(?:checkout|check-out|check\s+out)\s+(\d{4}-\d{2}-\d{2})/i,
        /(?:checkout|check-out|check\s+out)\s+(\d{2}\/\d{2}\/\d{4})/i,
        /(?:checkout|check-out|check\s+out)\s+(\d{2}-\d{2}-\d{4})/i
    ];
    let checkOut = null;
    for (const pattern of checkOutPatterns) {
        const match = query.match(pattern);
        if (match) {
            checkOut = normalizeDate(match[1]);
            break;
        }
    }
    
    // Extract number of guests - look for "for n guests" or "n guests" or "for n"
    const guestsPatterns = [
        /for\s+(\d+)\s+guests?/i,
        /(\d+)\s+guests?/i,
        /for\s+(\d+)(?:\s+guest|\s+people|\s+person|$)/i
    ];
    let guests = 2; // default
    for (const pattern of guestsPatterns) {
        const match = query.match(pattern);
        if (match) {
            guests = parseInt(match[1]);
            break;
        }
    }
    
    // Extract star rating - look for "X.X star" or "X.X rating" or "X star"
    const ratingPatterns = [
        /(\d+\.?\d*)\s+star/i,
        /(\d+\.?\d*)\s+rating/i,
        /rating\s+of\s+(\d+\.?\d*)/i
    ];
    let rating = null;
    for (const pattern of ratingPatterns) {
        const match = query.match(pattern);
        if (match) {
            rating = parseFloat(match[1]);
            break;
        }
    }
    
    // Extract room type - look for various room types
    const roomTypes = [
        'executive suite', 'deluxe room', 'beachfront villa', 'ocean view suite',
        'heritage room', 'mountain view room', 'business room', 'garden villa',
        'suite', 'villa', 'room'
    ];
    let roomType = null;
    for (const type of roomTypes) {
        const pattern = new RegExp(`(?:the\\s+|book\\s+the\\s+)?(${type.replace(/\s+/g, '\\s+')})`, 'i');
        const match = query.match(pattern);
        if (match) {
            roomType = match[1].trim();
            break;
        }
    }
    
    // Extract guest name - look for "guest named [name]" or "for [name]" or "name [name]"
    const namePatterns = [
        /guest\s+named\s+([a-zA-Z\s]+?)(?:\s+with|\s+email|$)/i,
        /for\s+guest\s+named\s+([a-zA-Z\s]+?)(?:\s+with|\s+email|$)/i,
        /name\s+([a-zA-Z\s]+?)(?:\s+with|\s+email|$)/i
    ];
    let guestName = null;
    for (const pattern of namePatterns) {
        const match = query.match(pattern);
        if (match) {
            guestName = match[1].trim();
            break;
        }
    }
    
    // Extract email - look for "email [email]"
    const emailMatch = query.match(/email\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    const email = emailMatch ? emailMatch[1] : null;
    
    // Extract phone - look for "phone number [number]" or "phone [number]"
    const phonePatterns = [
        /phone\s+number\s+([\d\s\+\-\(\)]+)/i,
        /phone\s+([\d\s\+\-\(\)]+)/i,
        /number\s+([\d\s\+\-\(\)]+)/i
    ];
    let phone = null;
    for (const pattern of phonePatterns) {
        const match = query.match(pattern);
        if (match) {
            phone = match[1].replace(/\s+/g, '');
            break;
        }
    }
    
    return {
        city,
        checkIn,
        checkOut,
        guests,
        rating,
        roomType,
        guestName,
        email,
        phone
    };
}

// Normalize date format to YYYY-MM-DD
function normalizeDate(dateStr) {
    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    
    // Try to parse other formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }
    
    return dateStr;
}

// Execute complete booking flow from natural language query
async function executeNaturalLanguageBooking(params) {
    const statusDiv = document.getElementById('nlSearchStatus');
    
    try {
        // Step 1: Search for hotels matching criteria
        statusDiv.innerHTML = '<div style="color: blue;">🔍 Searching hotels in ' + params.city + '...</div>';
        
        const searchParams = new URLSearchParams();
        if (params.city) searchParams.append('location', params.city);
        if (params.rating) searchParams.append('rating', params.rating);
        
        const hotelsResponse = await fetch(`${API_BASE}/api/hotels?${searchParams}`);
        const hotelsData = await hotelsResponse.json();
        
        if (!hotelsData.hotels || hotelsData.hotels.length === 0) {
            statusDiv.innerHTML = '<div style="color: red;">❌ No hotels found matching your criteria</div>';
            return;
        }
        
        // Step 2: Find hotel with matching room type
        statusDiv.innerHTML = '<div style="color: blue;">🏨 Finding matching hotel and room...</div>';
        
        let selectedHotel = null;
        let selectedRoom = null;
        
        for (const hotel of hotelsData.hotels) {
            // Get hotel details with rooms
            const hotelDetailsResponse = await fetch(`${API_BASE}/api/hotels/${hotel.id}`);
            const hotelDetails = await hotelDetailsResponse.json();
            
            // Find matching room type (flexible matching)
            const matchingRoom = hotelDetails.rooms.find(room => {
                if (!params.roomType) return true; // If no room type specified, use any room
                
                const roomTypeLower = room.type.toLowerCase();
                const searchTypeLower = params.roomType.toLowerCase();
                
                // Check for exact match or partial match
                if (roomTypeLower === searchTypeLower) return true;
                if (roomTypeLower.includes(searchTypeLower)) return true;
                if (searchTypeLower.includes(roomTypeLower)) return true;
                
                // Check for keyword matches (e.g., "suite" matches "executive suite")
                const searchKeywords = searchTypeLower.split(/\s+/);
                const roomKeywords = roomTypeLower.split(/\s+/);
                return searchKeywords.some(keyword => 
                    keyword.length > 3 && roomKeywords.some(roomKeyword => 
                        roomKeyword.includes(keyword) || keyword.includes(roomKeyword)
                    )
                );
            });
            
            if (matchingRoom && matchingRoom.maxGuests >= params.guests) {
                selectedHotel = hotelDetails;
                selectedRoom = matchingRoom;
                break;
            }
        }
        
        if (!selectedHotel || !selectedRoom) {
            // If no exact match, use first available room
            const firstHotel = hotelsData.hotels[0];
            const hotelDetailsResponse = await fetch(`${API_BASE}/api/hotels/${firstHotel.id}`);
            selectedHotel = await hotelDetailsResponse.json();
            selectedRoom = selectedHotel.rooms[0];
            
            statusDiv.innerHTML = '<div style="color: orange;">⚠️ Exact room type not found. Using available room...</div>';
        }
        
        // Step 3: Create checkout session
        statusDiv.innerHTML = '<div style="color: blue;">💳 Creating booking...</div>';
        
        const checkoutResponse = await fetch(`${API_BASE}/checkout-sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hotelId: selectedHotel.id,
                roomId: selectedRoom.id,
                checkIn: params.checkIn,
                checkOut: params.checkOut,
                guests: params.guests,
                currency: 'IDR'
            })
        });
        
        if (!checkoutResponse.ok) {
            throw new Error('Failed to create checkout session');
        }
        
        checkoutSession = await checkoutResponse.json();
        
        // Step 4: Complete booking with guest details
        statusDiv.innerHTML = '<div style="color: blue;">✅ Completing booking...</div>';
        
        const completeResponse = await fetch(`${API_BASE}/checkout-sessions/${checkoutSession.id}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        });
        
        if (!completeResponse.ok) {
            throw new Error('Failed to complete booking');
        }
        
        const booking = await completeResponse.json();
        
        // Step 5: Show success message
        const total = booking.totals.find(t => t.type === 'total')?.amount || 0;
        statusDiv.innerHTML = `
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
        `;
        
        // Clear the input
        document.getElementById('nlSearchInput').value = '';
        
        // Refresh hotel list
        loadHotels();
        
    } catch (error) {
        console.error('Error executing booking:', error);
        statusDiv.innerHTML = `<div style="color: red;">❌ Error: ${error.message}</div>`;
        throw error;
    }
}
