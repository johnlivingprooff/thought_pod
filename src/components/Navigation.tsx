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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Only check admin status on notes pages
    if (pathname.startsWith('/notes')) {
      checkAdminStatus().then(setIsAdmin).catch(() => setIsAdmin(false));
    }
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 border border-white/5 hover:border-white/10 rounded-lg px-4 py-2 space-x-6">
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
                pathname.startsWith('/notes') && !pathname.startsWith('/notes/episodes') ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Community Notes
            </Link>
            <Link
              href="/notes/episodes"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/notes/episodes') ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              Episode Notes
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

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
            <div className="px-4 py-2 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === '/' ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              <Link
                href="/notes"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname.startsWith('/notes') && !pathname.startsWith('/notes/episodes') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Community Notes
              </Link>
              <Link
                href="/notes/episodes"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname.startsWith('/notes/episodes') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Episode Notes
              </Link>
              {isAdmin && (
                <form action="/notes/admin/logout" method="POST" className="pt-2">
                  <button
                    type="submit"
                    className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium rounded-md border border-white/20 hover:border-white/30 transition-all duration-200"
                  >
                    Logout
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}