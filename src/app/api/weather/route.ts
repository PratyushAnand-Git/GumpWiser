import { NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchWeather();
    if (!data) {
      return NextResponse.json({ error: 'Weather data not available' }, { status: 503 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
