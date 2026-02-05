'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Thought } from '@/types';
import { useAudioStore } from '@/lib/audioStore';
import { useBookmarks } from '@/lib/useBookmarks';

interface EpisodeListProps {
  episodes: Thought[];
  selectedTheme: Thought['theme'] | null;
  showBookmarked?: boolean;
}

function getThemeColor(theme: Thought['theme']) {
  return {
    Capacity: '#60A5FA',
    Connection: '#4ADE80',
    Condition: '#C084FC',
    Commission: '#FB923C',
  }[theme];
}

export default function EpisodeList({
  episodes,
  selectedTheme,
  showBookmarked = false,
}: EpisodeListProps) {
  const { currentEpisode, isPlaying, playEpisode, togglePlayPause } = useAudioStore();
  const { isBookmarked } = useBookmarks();
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = episodes.filter(ep => {
    if (selectedTheme && ep.theme !== selectedTheme) return false;
    if (showBookmarked && !isBookmarked(ep.id)) return false;
    return true;
  });

  return (
    <section id="episodes" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {showBookmarked
              ? 'Bookmarked Thoughts'
              : selectedTheme
              ? `${selectedTheme} Episodes`
              : 'Latest Thoughts'}
          </h2>
          <p className="text-white/60 mt-2 text-sm sm:text-base">
            {showBookmarked
              ? 'Your saved episodes for later'
              : selectedTheme
              ? `Exploring the theme of ${selectedTheme}`
              : 'Short reflections to listen and return to'}
          </p>
        </motion.div>

        {/* List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-center text-white/60 py-12">
              Nothing here yet.
            </p>
          )}

          {filtered.map((episode, i) => {
            const active = currentEpisode?.id === episode.id;
            const playing = active && isPlaying;
            const color = getThemeColor(episode.theme);

            return (
              <motion.article
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.015 }}
                onHoverStart={() => setHovered(episode.id)}
                onHoverEnd={() => setHovered(null)}
                className={`
                  relative rounded-xl border overflow-hidden
                  transition-colors
                  ${active
                    ? 'bg-white/15 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'}
                `}
                style={
                  active
                    ? { boxShadow: `0 0 24px ${color}33` }
                    : undefined
                }
              >
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Left content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {playing && (
                        <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                          Playing
                        </span>
                      )}
                      {isBookmarked(episode.id) && (
                        <span className="text-xs px-2 py-1 rounded bg-yellow-400/20 text-yellow-400">
                          Bookmarked
                        </span>
                      )}
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: `${color}22`,
                          color,
                        }}
                      >
                        {episode.theme}
                      </span>
                      <span className="text-xs text-white/50">
                        {new Date(episode.pubDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                      {episode.title}
                    </h3>

                    <p className="text-white/70 text-sm line-clamp-2 sm:line-clamp-3">
                      {episode.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Link
                      href={`/notes/episode/${episode.slug}`}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
                      aria-label="Episode notes"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 14V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V17C4 18.6569 5.34315 20 7 20H13.5M20 14L13.5 20M20 14H15.5C14.3954 14 13.5 14.8954 13.5 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (active) {
                          togglePlayPause();
                        } else {
                          playEpisode(episode);
                        }
                      }}
                      className={`
                        w-10 h-10 sm:w-16 sm:h-16 rounded-full
                        border-2 flex items-center justify-center
                        ${active
                          ? 'bg-white/20 border-white/40'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'}
                      `}
                      aria-label={playing ? 'Pause' : 'Play'}
                    >
                      {playing ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M20 5L20 19C20 20.6569 18.6569 22 17 22L16 22C14.3431 22 13 20.6569 13 19L13 5C13 3.34314 14.3431 2 16 2L17 2C18.6569 2 20 3.34315 20 5Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M8 2C9.65685 2 11 3.34315 11 5L11 19C11 20.6569 9.65685 22 8 22L7 22C5.34315 22 4 20.6569 4 19L4 5C4 3.34314 5.34315 2 7 2L8 2Z" fill="currentColor"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M106.854 106.002a26.003 26.003 0 0 0-25.64 29.326c16 124 16 117.344 0 241.344a26.003 26.003 0 0 0 35.776 27.332l298-124a26.003 26.003 0 0 0 0-48.008l-298-124a26.003 26.003 0 0 0-10.136-1.994z"/>
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Bottom accent */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: color }}
                  animate={{ scaleX: hovered === episode.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  initial={{ scaleX: 0 }}
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
