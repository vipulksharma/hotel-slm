import { rooms } from '@/lib/data/hotels';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  
  const hotelRooms = rooms.filter(r => r.hotelId === id);
  
  // Simple availability check (in production, this would check actual bookings)
  const availableRooms = hotelRooms.filter(room => {
    if (guests && room.maxGuests < parseInt(guests)) return false;
    return true;
  });
  
  return NextResponse.json({
    rooms: availableRooms,
    checkIn,
    checkOut,
    guests: guests || 1
  });
}
