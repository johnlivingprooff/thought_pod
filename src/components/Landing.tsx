'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Thought } from '@/types';

interface LandingProps {
  onPlayLatest: () => void;
}

export default function Landing({ onPlayLatest }: LandingProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <Image
            src="/2.png"
            alt="Thought Podcast"
            width={400}
            height={150}
            className="mx-auto"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed"
        >
          A conversation at the intersection of <br />
          <span className="font-bold text-gray-300/90">Capacity</span>,{' '}
          <span className="font-bold text-gray-300/90">Connection</span>,{' '}
          <span className="font-bold text-gray-300/90">Condition</span>, and{' '}
          <span className="font-bold text-gray-300/90">Commission</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative cursor-pointer inline-block z-10"
        >
          <div 
            className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full p-2 hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-500 ease-out hover:pr-6 relative z-20"
            onClick={onPlayLatest}
            style={{
              width: '80px',
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.width = '280px';
              const span = e.currentTarget.querySelector('span');
              if (span) {
                (span as HTMLElement).style.opacity = '1';
                (span as HTMLElement).style.width = 'auto';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.width = '80px';
              const span = e.currentTarget.querySelector('span');
              if (span) {
                (span as HTMLElement).style.opacity = '0';
                (span as HTMLElement).style.width = '0px';
              }
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.width = '280px';
              const span = e.currentTarget.querySelector('span');
              if (span) {
                (span as HTMLElement).style.opacity = '1';
                (span as HTMLElement).style.width = 'auto';
              }
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.width = '80px';
              const span = e.currentTarget.querySelector('span');
              if (span) {
                (span as HTMLElement).style.opacity = '0';
                (span as HTMLElement).style.width = '0px';
              }
            }}
            role="button"
            aria-label="Play Latest Thought"
            tabIndex={0}
          >
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center relative z-30">
              <Image
                src="/icon.svg"
                alt="Play Latest Thought"
                width={80}
                height={80}
                className="w-full h-full"
                priority
              />
            </div>
            <span
              className="text-white font-semibold whitespace-nowrap overflow-hidden transition-all duration-500 delay-100 relative z-30"
              style={{
                opacity: 0,
                width: '0px',
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              Play Latest Thought
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex gap-4 justify-center items-center"
        >
          <div className="h-px w-20 bg-white/30"></div>
          <p className="text-white/60 text-sm">Scroll to explore</p>
          <div className="h-px w-20 bg-white/30"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
