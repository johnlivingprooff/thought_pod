import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateNoteStatus } from '@/lib/db';

export async function POST(request: NextRequest) {
  // Check admin auth
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('role')?.value;
  if (adminCookie !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { noteId, status } = await request.json();

  if (!noteId || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const validStatuses = ['published', 'pending', 'flagged'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    await updateNoteStatus(status, noteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating note status:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}