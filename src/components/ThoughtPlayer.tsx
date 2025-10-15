'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '@/lib/audioStore';
import { Thought } from '@/types';

interface ThoughtPlayerProps {
  episodes: Thought[];
}

export default function ThoughtPlayer({ episodes }: ThoughtPlayerProps) {
  const {
    currentEpisode,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlayPause,
    skipForward,
    skipBackward,
    setVolume,
    playNext,
    playPrevious,
    seek,
    sound
  } = useAudioStore();

  const [visible, setVisible] = useState(true);

  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentEpisode || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10"
        role="region"
        aria-label="Audio player"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          {/* Close Button - mobile optimized, floating top-left */}
          <button
            onClick={() => {
              setVisible(false);
              if (sound) {
                sound.stop();
              }
            }}
            className="fixed top-4 left-4 z-[100] w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center shadow-lg border border-white/20"
            aria-label="Close player"
            style={{ touchAction: 'manipulation' }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              className="h-1 bg-white/20 rounded-full cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                seek(percentage * duration);
              }}
              role="slider"
              aria-label="Seek audio position"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              tabIndex={0}
            >
              <div 
                className="h-full bg-white rounded-full transition-all duration-300 group-hover:bg-blue-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span aria-label="Current time">{formatTime(currentTime)}</span>
              <span aria-label="Duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Episode Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate text-sm md:text-base">
                {currentEpisode.title}
              </h3>
              <p className="text-white/60 text-xs truncate">
                {new Date(currentEpisode.pubDate).toLocaleDateString()}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Previous */}
              <button
                onClick={() => playPrevious(episodes)}
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Previous episode"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              {/* Skip Backward */}
              <button
                onClick={() => skipBackward()}
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Skip backward 15 seconds"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.10-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z"/>
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="bg-white text-black rounded-full p-3 hover:scale-110 transition-transform"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skipForward()}
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Skip forward 15 seconds"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8zm6.8 3h-.9v-3.3l-1 .3v-.7l1.8-.6h.1V16zm4.3-1.8c0 .3 0 .6-.1.8s-.2.4-.3.6-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8s.2-.4.3-.6.3-.3.5-.3.4-.1.6-.1.4 0 .6.1.3.2.5.3.2.3.3.6.1.5.1.8v.7zm-.8-.9c0-.2 0-.3 0-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2 0-.2 0-.2 0-.3 0-.1.1-.2.2-.1.2-.1.3 0 .3 0 .5v1c0 .2 0 .4 0 .5s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1.1-.1.2-.2.1-.2.1-.3 0-.3 0-.5v-1z"/>
                </svg>
              </button>

              {/* Next */}
              <button
                onClick={() => playNext(episodes)}
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Next episode"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2 min-w-[120px]">
              <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, white ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
