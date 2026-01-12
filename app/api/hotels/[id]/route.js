import { getHotelsData, getRoomsData, findHotel } from '@/lib/data/store_adapter';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const hotel = findHotel(id);
  
  if (!hotel) {
    return NextResponse.json(
      { error: 'Hotel not found' },
      { status: 404 }
    );
  }
  
  const rooms = getRoomsData();
  const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
  return NextResponse.json({
    ...hotel,
    rooms: hotelRooms
  });
}
