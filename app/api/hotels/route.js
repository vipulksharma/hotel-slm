import { hotels } from '@/lib/data/hotels';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const rating = searchParams.get('rating');
  
  let filteredHotels = [...hotels];
  
  if (location) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (minPrice) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.pricePerNight >= parseInt(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.pricePerNight <= parseInt(maxPrice)
    );
  }
  
  if (rating) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.rating >= parseFloat(rating)
    );
  }
  
  return NextResponse.json({
    hotels: filteredHotels,
    total: filteredHotels.length
  });
}
