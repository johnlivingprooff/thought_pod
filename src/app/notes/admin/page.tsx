import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getAllNotes } from '@/lib/db';
import { Note } from '@/types';
import Starfield from '@/components/Starfield';
import AdminLogin from '@/components/notes/AdminLogin';
import AdminNotesList from '@/components/notes/AdminNotesList';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('role')?.value;
  return adminCookie === 'admin';
}

export default async function AdminPage() {
  const isAdmin = await checkAdminAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-screen relative">
        <Starfield themeColor={undefined} />
        <div className="relative z-10 pt-24 px-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h1>
            <AdminLogin />
          </div>
        </div>
      </div>
    );
  }

  const notes = getAllNotes.all() as Note[];

  return (
    <div className="min-h-screen relative">
      <Starfield themeColor={undefined} />
      <div className="relative z-10 pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <form action="/notes/admin/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </form>
          </div>

          <Suspense fallback={<div className="text-white/50 text-center py-12">Loading notes...</div>}>
            <AdminNotesList notes={notes} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}