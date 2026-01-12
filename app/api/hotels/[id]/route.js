import { hotels, rooms } from '@/lib/data/hotels';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const hotel = hotels.find(h => h.id === id);
  
  if (!hotel) {
    return NextResponse.json(
      { error: 'Hotel not found' },
      { status: 404 }
    );
  }
  
  const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
  return NextResponse.json({
    ...hotel,
    rooms: hotelRooms
  });
}
