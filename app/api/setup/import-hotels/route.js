import { NextResponse } from 'next/server';
import { importHotels } from '@/lib/ucp/import_hotels';

/**
 * POST /api/setup/import-hotels
 * 
 * Imports hotels and rooms into the UCP business store.
 * This endpoint is used for production database setup.
 * 
 * Returns:
 * - 200: Success with import statistics
 * - 500: Error during import
 */
export async function POST() {
  try {
    const result = importHotels();
    
    return NextResponse.json({
      success: true,
      message: 'Hotels successfully imported to UCP business store',
      data: {
        hotelsImported: result.hotels,
        roomsImported: result.rooms
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error importing hotels:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to import hotels',
        message: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
