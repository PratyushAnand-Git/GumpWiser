/**
 * Weather Service for GumpWiser
 * Fetches data from WeatherAPI.com
 * Location: Montgomery, AL (32.3668, -86.3006)
 */

const BASE_URL = 'https://api.weatherapi.com/v1';
const LOCATION = '32.3668,-86.3006'; // Montgomery, AL

export interface WeatherData {
  current: {
    temp_f: number;
    condition: { text: string; icon: string };
    feelslike_f: number;
    humidity: number;
    wind_mph: number;
    wind_dir: string;
    uv: number;
    vis_miles: number;
    pressure_in: number;
    dewpoint_f: number;
    air_quality: {
      pm2_5: number;
      o3: number;
      no2: number;
      co: number;
      "us-epa-index": number;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_f: number;
        mintemp_f: number;
        condition: { text: string; icon: string };
      };
      hour: Array<{
        time: string;
        temp_f: number;
        condition: { text: string; icon: string };
      }>;
    }>;
  };
  alerts?: {
    alert: Array<{
      headline: string;
      msgType: string;
      severity: string;
      urgency: string;
      areas: string;
      category: string;
      certainty: string;
      event: string;
      note: string;
      effective: string;
      expires: string;
      desc: string;
      instruction: string;
    }>;
  };
}

export async function fetchWeather(): Promise<WeatherData | null> {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_weatherapi_com_key_here') {
    console.warn('[Weather] API key is missing or placeholder.');
    return null;
  }

  try {
    const url = `${BASE_URL}/forecast.json?key=${apiKey}&q=${LOCATION}&days=7&aqi=yes&alerts=yes`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 mins
    
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[Weather] API Error ${res.status}:`, errBody);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('[Weather] Fetch Exception:', error);
    return null;
  }
}
