'use client';

import { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const AMBIENT_URL = 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3'; // Use ambient sound from previous component

  useEffect(() => {
    setIsMounted(true);
    
    // Initialize Howler with ambient music
    // Using a calming ambient background track
    soundRef.current = new Howl({
      src: [AMBIENT_URL],
      loop: true,
      volume: 0.3,
      html5: true,
      autoplay: false,
      onload: () => {
        console.log('Ambient audio loaded');
      },
      onloaderror: (_id: number, error: unknown) => {
        console.error('Ambient audio load error:', error);
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.mute(true);
        soundRef.current.pause();
      } else {
        soundRef.current.mute(false);
        soundRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-6 right-6 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-4 hover:bg-white/20 transition-all duration-300"
  aria-label={isPlaying ? 'Mute ambient audio' : 'Unmute ambient audio'}
    >
      {isPlaying ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      )}
    </button>
  );
}
