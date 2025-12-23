'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '@/assets/2.png';
import { checkAdminStatus } from '@/app/notes/actions';

export default function Navigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin status using server action
    checkAdminStatus().then(setIsAdmin).catch(() => setIsAdmin(false));
  }, []);

  // Don't show navigation on the main page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-white font-bold text-xl hover:text-white/80 transition-colors"
          >
            {logo && (
              <Image src={logo.src} alt="Thought Pod" height={60} width={60} className="h-15 w-auto" />
            )}
          </Link>

          <div className="flex items-center bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 border border-white/5 hover:border-white/10 rounded-lg px-4 py-2 space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/notes"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/notes') ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Community Notes
            </Link>
            {isAdmin && (
              <form action="/notes/admin/logout" method="POST" className="inline">
                <button
                  type="submit"
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium rounded-md border border-white/20 hover:border-white/30 transition-all duration-200"
                >
                  Logout
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}