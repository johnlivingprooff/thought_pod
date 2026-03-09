import { NextResponse } from 'next/server';
import { getEpisodeNoteSlugs } from '@/lib/episodeNotes';

export async function GET() {
  try {
    const slugs = await getEpisodeNoteSlugs();
    return NextResponse.json({ slugs });
  } catch (error) {
    console.error('Error fetching available note slugs:', error);
    return NextResponse.json({ slugs: [] }, { status: 500 });
  }
}
