import { NextResponse } from 'next/server';
import { fetchTrendingRumors } from '@/lib/brightData';

export async function GET() {
    try {
        const rumors = await fetchTrendingRumors();
        return NextResponse.json({ rumors });
    } catch (error) {
        console.error("Error fetching trending rumors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
