import { createCheckoutSession } from '@/lib/services/checkout';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const session = createCheckoutSession(body);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
