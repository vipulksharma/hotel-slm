import { completeCheckout } from '@/lib/services/checkout';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Checkout session ID is required' },
        { status: 400 }
      );
    }
    
    const booking = completeCheckout(id, body);
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error completing checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete checkout' },
      { status: 400 }
    );
  }
}
