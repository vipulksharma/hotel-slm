import { completeCheckout } from '@/lib/services/checkout';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const booking = completeCheckout(id, body);
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
