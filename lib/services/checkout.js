import { hotels, rooms, bookings } from '../data/hotels';

// Simple UUID generator
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// In-memory checkout sessions storage
const checkoutSessions = {};

// Discount codes
const discounts = {
  'WELCOME10': { code: 'WELCOME10', title: 'Welcome 10% Off', percent: 10 },
  'SUMMER20': { code: 'SUMMER20', title: 'Summer Special 20% Off', percent: 20 },
  'EARLYBIRD15': { code: 'EARLYBIRD15', title: 'Early Bird 15% Off', percent: 15 }
};

function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
}

export function createCheckoutSession(data) {
  const {
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    buyer,
    currency = 'IDR'
  } = data;

  if (!hotelId || !roomId || !checkIn || !checkOut) {
    throw new Error('Missing required fields: hotelId, roomId, checkIn, checkOut');
  }

  const hotel = hotels.find(h => h.id === hotelId);
  const room = rooms.find(r => r.id === roomId && r.hotelId === hotelId);

  if (!hotel || !room) {
    throw new Error('Hotel or room not found');
  }

  const nights = calculateNights(checkIn, checkOut);
  const subtotal = room.pricePerNight * nights;
  const total = subtotal;

  const sessionId = uuidv4();
  const lineItemId = uuidv4();

  const session = {
    ucp: {
      version: '2026-01-11',
      capabilities: [
        {
          name: 'dev.ucp.shopping.checkout',
          version: '2026-01-11'
        }
      ]
    },
    id: sessionId,
    line_items: [
      {
        id: lineItemId,
        item: {
          id: room.id,
          title: `${hotel.name} - ${room.type}`,
          description: room.description,
          price: room.pricePerNight,
          hotel: {
            id: hotel.id,
            name: hotel.name,
            location: hotel.location
          },
          room: {
            id: room.id,
            type: room.type,
            maxGuests: room.maxGuests
          },
          checkIn,
          checkOut,
          nights,
          guests: guests || 1
        },
        quantity: 1,
        totals: [
          { type: 'subtotal', amount: subtotal },
          { type: 'total', amount: total }
        ]
      }
    ],
    buyer: buyer || {},
    status: 'ready_for_complete',
    currency,
    totals: [
      { type: 'subtotal', amount: subtotal },
      { type: 'total', amount: total }
    ],
    links: [],
    payment: {
      handlers: [],
      instruments: []
    },
    discounts: {}
  };

  checkoutSessions[sessionId] = session;
  return session;
}

export function updateCheckoutSession(sessionId, data) {
  const session = checkoutSessions[sessionId];
  if (!session) {
    throw new Error('Checkout session not found');
  }

  // Update line items if provided
  if (data.line_items) {
    session.line_items = data.line_items;
  }

  // Update buyer info if provided
  if (data.buyer) {
    session.buyer = { ...session.buyer, ...data.buyer };
  }

  // Apply discounts if provided
  if (data.discounts && data.discounts.codes) {
    const appliedDiscounts = [];
    let totalDiscount = 0;

    data.discounts.codes.forEach(code => {
      const discount = discounts[code];
      if (discount) {
        const subtotal = session.totals.find(t => t.type === 'subtotal')?.amount || 0;
        const discountAmount = Math.floor(subtotal * discount.percent / 100);
        totalDiscount += discountAmount;

        appliedDiscounts.push({
          code: discount.code,
          title: discount.title,
          amount: discountAmount,
          automatic: false,
          allocations: [
            { path: 'subtotal', amount: discountAmount }
          ]
        });
      }
    });

    session.discounts = {
      codes: data.discounts.codes,
      applied: appliedDiscounts
    };

    // Recalculate totals
    const subtotal = session.totals.find(t => t.type === 'subtotal')?.amount || 0;
    const total = subtotal - totalDiscount;

    session.totals = [
      { type: 'subtotal', amount: subtotal },
      ...(totalDiscount > 0 ? [{ type: 'discount', amount: totalDiscount }] : []),
      { type: 'total', amount: total }
    ];
  }

  // Update payment instruments/handlers if provided
  if (data.payment) {
    session.payment = { ...session.payment, ...data.payment };
  }

  checkoutSessions[sessionId] = session;
  return session;
}

export function completeCheckout(sessionId, data) {
  const session = checkoutSessions[sessionId];
  if (!session) {
    throw new Error('Checkout session not found');
  }

  if (session.status !== 'ready_for_complete') {
    throw new Error('Checkout session is not ready for completion');
  }

  // Create booking
  const bookingId = uuidv4();
  const lineItem = session.line_items[0];
  const booking = {
    id: bookingId,
    ucp: {
      version: '2026-01-11',
      capabilities: [
        {
          name: 'dev.ucp.hotel.booking',
          version: '2026-01-11'
        }
      ]
    },
    status: 'confirmed',
    hotel: lineItem.item.hotel,
    room: lineItem.item.room,
    checkIn: lineItem.item.checkIn,
    checkOut: lineItem.item.checkOut,
    nights: lineItem.item.nights,
    guests: lineItem.item.guests,
    buyer: session.buyer,
    currency: session.currency,
    totals: session.totals,
    discounts: session.discounts,
    payment: {
      method: data.payment?.method || 'credit_card',
      status: 'completed',
      transactionId: uuidv4()
    },
    createdAt: new Date().toISOString(),
    confirmationNumber: `HTL-${bookingId.substring(0, 8).toUpperCase()}`
  };

  bookings.push(booking);
  session.status = 'completed';
  session.bookingId = bookingId;

  return booking;
}
