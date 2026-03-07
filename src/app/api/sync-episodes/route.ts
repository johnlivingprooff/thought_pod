import { NextResponse } from 'next/server';
import { syncEpisodesToDatabase } from '@/lib/rssParser';
import { syncNotesFromMarkdown } from '@/lib/noteSync';
import { checkAdminStatus } from '@/app/notes/actions';

export async function GET() {
  try {
    // Check if user is admin (optional - remove if you want public access)
    const isAdmin = await checkAdminStatus();

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('Starting episode and note sync...');
    const episodeSyncResult = await syncEpisodesToDatabase();
    const noteSyncResult = await syncNotesFromMarkdown();

    return NextResponse.json({
      message: 'Episodes and notes synced successfully',
      episodes: episodeSyncResult,
      notes: noteSyncResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error syncing episodes:', error);
    return NextResponse.json({
      error: 'Failed to sync episodes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also allow POST for easier integration
export async function POST() {
  return GET();
}
