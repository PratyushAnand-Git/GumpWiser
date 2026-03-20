import { NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchWeather();
    if (!data) {
      const apiKey = process.env.WEATHER_API_KEY;
      return NextResponse.json({ 
        error: 'Weather data not available', 
        diagnostics: { key_exists: !!apiKey, key_placeholder: apiKey === 'your_weatherapi_com_key_here' } 
      }, { status: 503 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
