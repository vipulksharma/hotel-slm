// UCP Discovery Service
// Returns business capabilities profile following UCP specification

export function discoverCapabilities() {
  return {
    version: '2026-01-11',
    business: {
      id: 'hotel-booking-demo',
      name: 'Hotel Booking Demo',
      description: 'Sample hotel booking service using UCP'
    },
    capabilities: [
      {
        name: 'dev.ucp.shopping.checkout',
        version: '2026-01-11',
        transport: {
          type: 'REST',
          endpoints: {
            create: '/api/checkout-sessions',
            update: '/api/checkout-sessions/{id}',
            complete: '/api/checkout-sessions/{id}/complete'
          }
        },
        extensions: [
          {
            name: 'dev.ucp.shopping.discounts',
            version: '2026-01-11'
          }
        ]
      },
      {
        name: 'dev.ucp.hotel.discovery',
        version: '2026-01-11',
        transport: {
          type: 'REST',
          endpoints: {
            search: '/api/hotels',
            details: '/api/hotels/{id}',
            rooms: '/api/hotels/{id}/rooms'
          }
        }
      },
      {
        name: 'dev.ucp.hotel.booking',
        version: '2026-01-11',
        transport: {
          type: 'REST',
          endpoints: {
            create: '/api/checkout-sessions',
            get: '/api/bookings/{id}'
          }
        }
      }
    ],
    payment: {
      handlers: [
        {
          id: 'mock_payment_handler',
          name: 'dev.ucp.mock_payment',
          version: '2026-01-11',
          spec: 'https://ucp.dev/specs/mock',
          config_schema: 'https://ucp.dev/schemas/mock.json',
          instrument_schemas: [
            'https://ucp.dev/schemas/shopping/types/card_payment_instrument.json'
          ],
          config: {
            supported_tokens: ['success_token', 'fail_token']
          }
        }
      ],
      instruments: [
        {
          id: 'credit_card',
          name: 'Credit Card',
          type: 'card'
        }
      ]
    }
  };
}
