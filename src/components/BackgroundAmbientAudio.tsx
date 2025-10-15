'use client';

import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

const AMBIENT_URL = 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3'; // Replace with your preferred ambient sound

export default function BackgroundAmbientAudio() {
  const [isMuted, setIsMuted] = useState(true);
  const [hasPrompted, setHasPrompted] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [AMBIENT_URL],
      loop: true,
      volume: 0.3,
      html5: true,
      autoplay: false,
    });
    return () => {
      soundRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.mute(isMuted);
      if (!isMuted && !soundRef.current.playing()) {
        soundRef.current.play();
      }
    }
  }, [isMuted]);

  const handleEnterSpace = () => {
    setIsMuted(false);
    setHasPrompted(true);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {!hasPrompted && (
        <button
          onClick={handleEnterSpace}
          className="bg-black/80 text-white px-4 py-2 rounded-full shadow-lg hover:bg-black/60 transition"
          aria-label="Enter the Space and enable ambient audio"
        >
          Enter the Space
        </button>
      )}
      <button
        onClick={() => setIsMuted((m) => !m)}
        className="mt-2 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-black/50 transition"
          aria-label={isMuted ? "Unmute background audio" : "Mute background audio"}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') setIsMuted((m) => !m);
          }}
      >
        {isMuted ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 9v6h4l5 5V4l-5 5H9z" />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 9v6h4l5 5V4l-5 5H9z" />
          </svg>
        )}
      </button>
    </div>
  );
}
