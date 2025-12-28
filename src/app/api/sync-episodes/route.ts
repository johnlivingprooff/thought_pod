import { NextResponse } from 'next/server';
import { syncEpisodesToDatabase } from '@/lib/rssParser';
import { checkAdminStatus } from '@/app/notes/actions';

export async function GET(request: Request) {
  try {
    // Check if user is admin (optional - remove if you want public access)
    const isAdmin = await checkAdminStatus();

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('Starting episode sync...');
    await syncEpisodesToDatabase();

    return NextResponse.json({
      message: 'Episodes synced successfully',
      timestamp: new Date().toISOString()
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
export async function POST(request: Request) {
  return GET(request);
}