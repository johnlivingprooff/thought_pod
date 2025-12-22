import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { secret } = await request.json();

  if (secret === process.env.ADMIN_SECRET) {
    const cookieStore = await cookies();
    cookieStore.set('role', 'admin', {
      httpOnly: false, // Allow client-side access for UI purposes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
}