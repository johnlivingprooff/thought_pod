import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('role');

  return NextResponse.redirect(new URL('/notes/admin', process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'));
}