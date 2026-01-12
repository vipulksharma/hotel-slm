import { bookings } from '@/lib/data/hotels';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const booking = bookings.find(b => b.id === id);
  
  if (!booking) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(booking);
}
