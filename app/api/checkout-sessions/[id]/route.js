import { updateCheckoutSession } from '@/lib/services/checkout';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const session = updateCheckoutSession(id, body);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
