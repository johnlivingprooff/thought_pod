import { NextResponse } from 'next/server';
import { getThoughts } from '@/lib/rssParser';
import { getEpisodes } from '@/lib/db';
import { syncEpisodesToDatabase } from '@/lib/rssParser';

export async function GET() {
  try {
    // Check if we have episodes in database
    const dbEpisodes = await getEpisodes();

    // If no episodes in database, try to sync from RSS
    if (dbEpisodes.rows.length === 0) {
      console.log('No episodes in database, syncing from RSS...');
      try {
        await syncEpisodesToDatabase();
      } catch (syncError) {
        console.error('Failed to sync episodes:', syncError);
        // Continue with RSS feed as fallback
      }
    }

    // Always return from RSS feed for latest data
    const thoughts = await getThoughts();
    return NextResponse.json(thoughts);
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
  }
}
