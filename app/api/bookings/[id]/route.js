import { getBookingsData, findBooking } from '@/lib/data/store_adapter';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const booking = findBooking(id);
  
  if (!booking) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(booking);
}
