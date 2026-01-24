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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Only check admin status on notes pages
    if (pathname.startsWith('/notes/')) {
      checkAdminStatus().then(setIsAdmin).catch(() => setIsAdmin(false));
    }
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle scroll detection for blur background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/10 backdrop-blur-sm border-b border-white/5' : ''
    }`}>
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
                pathname.startsWith('/notes') ? 'text-white' : 'text-white/70 hover:text-white'
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

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Full-screen Menu */}
            <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center">
              <div className="w-full max-w-sm mx-6 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors z-10"
                  aria-label="Close mobile menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="px-6 py-8 space-y-2">
                  <Link
                    href="/"
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                      pathname === '/' ? 'text-white bg-white/10 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/notes"
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                      pathname.startsWith('/notes') ? 'text-white bg-white/10 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Episode Notes
                  </Link>
                  {isAdmin && (
                    <div className="pt-4 border-t border-white/10">
                      <form action="/notes/admin/logout" method="POST">
                        <button
                          type="submit"
                          className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-base font-medium rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200"
                        >
                          Logout
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}