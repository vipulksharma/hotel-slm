import { discoverCapabilities } from '@/lib/services/discovery';
import { NextResponse } from 'next/server';

export async function GET() {
  const profile = discoverCapabilities();
  return NextResponse.json(profile);
}
