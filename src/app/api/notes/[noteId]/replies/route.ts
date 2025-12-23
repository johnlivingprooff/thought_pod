import { NextRequest, NextResponse } from 'next/server';
import { getNoteReplies } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params;
    const result = await getNoteReplies(noteId);
    const replies = result.rows;
    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}