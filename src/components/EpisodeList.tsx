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

  const handleClick = (episode: Thought) => {
    currentEpisode?.id === episode.id ? togglePlayPause() : playEpisode(episode);
  };

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
                onClick={() => handleClick(episode)}
                className={`
                  relative rounded-xl border overflow-hidden cursor-pointer
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
                      href={`/notes/episode/${episode.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')}`}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
                      aria-label="Episode notes"
                    >
                      📝
                    </Link>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-full
                        border-2 flex items-center justify-center
                        ${active
                          ? 'bg-white/20 border-white/40'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'}
                      `}
                      aria-label={playing ? 'Pause' : 'Play'}
                    >
                      {playing ? (
                        <div className="flex gap-1">
                          <span className="w-1.5 h-6 bg-white" />
                          <span className="w-1.5 h-6 bg-white" />
                        </div>
                      ) : (
                        <span className="ml-1 text-white text-xl">▶</span>
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
