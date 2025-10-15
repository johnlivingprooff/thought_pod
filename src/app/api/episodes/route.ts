import { NextResponse } from 'next/server';
import { getThoughts } from '@/lib/rssParser';

export async function GET() {
  try {
    const thoughts = await getThoughts();
    return NextResponse.json(thoughts);
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
  }
}
