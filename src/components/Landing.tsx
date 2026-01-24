'use client';

import RotatingGlobe from './RotatingGlobe';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <RotatingGlobe />

      {/* Hero Text */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-left z-10 pl-24">
        <p className="text-white/80 text-xl mb-4 font-light">
          Conversations around the <strong className="font-bold">Human Experience</strong>
        </p>
        <Link
          href="#episodes"
          className="text-white/60 hover:text-white transition-colors text-lg underline decoration-1 underline-offset-4"
        >
          Latest Episode
        </Link>
      </div>
    </div>
  );
}
