import { NextRequest, NextResponse } from 'next/server';
import { addReply } from '@/app/notes/actions';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    await addReply(formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}