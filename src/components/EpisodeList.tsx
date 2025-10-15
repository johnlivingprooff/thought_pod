'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Thought } from '@/types';
import { useAudioStore } from '@/lib/audioStore';
import { useBookmarks } from '@/lib/useBookmarks';


interface EpisodeListProps {
  episodes: Thought[];
  selectedTheme: Thought['theme'] | null;
  showBookmarked?: boolean;
}

// Four Cs keywords and synonyms
const fourCsKeywords: Record<Thought['theme'], string[]> = {
  Capacity: [
    'capacity', 'grow', 'growth', 'potential', 'ability', 'expand', 'learn', 'learning', 'strength', 'capable', 'improve', 'develop', 'skills', 'performance', 'unlock', 'continuous', 'journey', 'capabilities', 'build', 'building'
  ],
  Connection: [
    'connection', 'connect', 'relationships', 'bond', 'community', 'empathy', 'vulnerability', 'support', 'shared', 'genuine', 'authentic', 'friendship', 'together', 'network', 'relate', 'relationship', 'interact', 'interaction', 'belong', 'belonging'
  ],
  Condition: [
    'condition', 'state', 'present', 'circumstance', 'accept', 'acceptance', 'awareness', 'current', 'honest', 'self-assessment', 'recognize', 'recognition', 'now', 'situation', 'reality', 'truth', 'assessment', 'understand', 'understanding', 'mindset'
  ],
  Commission: [
    'commission', 'purpose', 'calling', 'role', 'mission', 'gift', 'perspective', 'offer', 'unique', 'discover', 'live', 'living', 'step', 'bold', 'mark', 'impact', 'contribute', 'contribution', 'serve', 'service', 'meaning', 'meaningful'
  ]
};

// Simple similarity algorithm: checks for keyword presence in description
function autoTagEpisode(description: string): Thought['theme'] | null {
  const desc = description.toLowerCase();
  let bestMatch: Thought['theme'] | null = null;
  let maxHits = 0;
  for (const theme of Object.keys(fourCsKeywords) as Thought['theme'][]) {
    const hits = fourCsKeywords[theme].reduce((acc, word) => acc + (desc.includes(word) ? 1 : 0), 0);
    if (hits > maxHits) {
      maxHits = hits;
      bestMatch = theme;
    }
  }
  // If no hits, return null
  return maxHits > 0 ? bestMatch : null;
}

function getThemeColor(theme: Thought['theme']): string {
  const colors = {
    Capacity: '#60A5FA',
    Connection: '#4ADE80',
    Condition: '#C084FC',
    Commission: '#FB923C'
  };
  return colors[theme];
}

export default function EpisodeList({ episodes, selectedTheme, showBookmarked = false }: EpisodeListProps) {
  const { currentEpisode, isPlaying, playEpisode, togglePlayPause } = useAudioStore();
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);
  const { toggleBookmark, isBookmarked } = useBookmarks();

  // Filter episodes by theme and bookmarked status
  let filteredEpisodes = episodes;
  
  if (selectedTheme) {
    filteredEpisodes = filteredEpisodes.filter(ep => ep.theme === selectedTheme);
  }
  
  if (showBookmarked) {
    filteredEpisodes = filteredEpisodes.filter(ep => isBookmarked(ep.id));
  }

  const handleEpisodeClick = (episode: Thought) => {
    if (currentEpisode?.id === episode.id) {
      togglePlayPause();
    } else {
      playEpisode(episode);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent, episodeId: string) => {
    e.stopPropagation(); // Prevent episode click
    toggleBookmark(episodeId);
  };

  return (
    <section id="episodes" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            {showBookmarked 
              ? 'Bookmarked Thoughts' 
              : selectedTheme 
                ? `${selectedTheme} Episodes` 
                : 'Latest Thoughts'
            }
          </h2>
          {selectedTheme && !showBookmarked && (
            <p className="text-white/60 text-center mb-8">
              Exploring the theme of {selectedTheme}
            </p>
          )}
          {showBookmarked && (
            <p className="text-white/60 text-center mb-8">
              Your saved episodes for later
            </p>
          )}
        </motion.div>

        <div className="space-y-4 mt-12">
          {filteredEpisodes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/60 py-12"
            >
              <p>
                {showBookmarked 
                  ? 'No bookmarked episodes yet. Click the bookmark icon to save episodes for later.' 
                  : 'No episodes found for this theme.'}
              </p>
            </motion.div>
          ) : (
            filteredEpisodes.map((episode, index) => {
              const isCurrentEpisode = currentEpisode?.id === episode.id;
              const isCurrentlyPlaying = isCurrentEpisode && isPlaying;
              const isHovered = hoveredEpisode === episode.id;

              // Auto-tag episode if not already tagged
              const autoTag = autoTagEpisode(episode.description);
              const displayTheme = episode.theme || autoTag;

              return (
                <motion.div
                  key={episode.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleEpisodeClick(episode)}
                  onHoverStart={() => setHoveredEpisode(episode.id)}
                  onHoverEnd={() => setHoveredEpisode(null)}
                  className={`
                    relative group cursor-pointer rounded-xl p-6 transition-all duration-300 overflow-hidden
                    ${isCurrentEpisode 
                      ? 'bg-white/15 border-2' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }
                  `}
                  style={isCurrentEpisode ? {
                    borderColor: getThemeColor(displayTheme) + '60',
                    boxShadow: `0 0 20px ${getThemeColor(displayTheme)}40`
                  } : {}}
                >
                  {/* Animated ripple effect on hover */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${getThemeColor(episode.theme)}30, transparent 60%)`
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}

                  {/* Enhanced glow for currently playing */}
                  {isCurrentlyPlaying && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `radial-gradient(circle at center, ${getThemeColor(episode.theme)}15, transparent 70%)`
                        }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Particle sparkles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: getThemeColor(episode.theme),
                            left: `${20 + i * 30}%`,
                            top: '50%'
                          }}
                          animate={{
                            y: [-10, -30, -10],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </>
                  )}

                  <div
                    className="relative flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                  >
                    {/* Status and Tag Row */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap order-1 md:order-none">
                      {/* Status (playing/bookmarked) */}
                      {isCurrentlyPlaying && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400">Playing</span>
                      )}
                      {isBookmarked(episode.id) && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-400/20 text-yellow-400">Bookmarked</span>
                      )}
                      {/* Theme Badge */}
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: getThemeColor(displayTheme) + '20',
                          color: getThemeColor(displayTheme)
                        }}
                        whileHover={{
                          backgroundColor: getThemeColor(displayTheme) + '40',
                          scale: 1.05
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {displayTheme}
                      </motion.span>
                      <span className="text-white/50 text-sm">
                        {new Date(episode.pubDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 min-w-0 order-2 md:order-none">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                        {episode.title}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2 mb-4">
                        {episode.description}
                      </p>
                    </div>

                    {/* Action Buttons: below description on mobile, right on desktop */}
                    <div className="flex gap-4 mt-2 order-3 md:order-none md:mt-0 md:ml-6">
                      {/* Bookmark Button */}
                      <motion.button
                        onClick={(e) => handleBookmarkClick(e, episode.id)}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={isBookmarked(episode.id) ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        {isBookmarked(episode.id) ? (
                          <svg className="w-6 h-6" fill={getThemeColor(episode.theme)} viewBox="0 0 24 24">
                            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                          </svg>
                        )}
                      </motion.button>

                      {/* Enhanced Play Button */}
                      <motion.button
                        className={`
                          w-16 h-16 rounded-full flex items-center justify-center
                          transition-all duration-300 border-2 relative overflow-hidden
                          ${isCurrentEpisode 
                            ? 'bg-white/20 border-white/40' 
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                          }
                        `}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                      >
                        {/* Rotating border glow on hover */}
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(from 0deg, transparent, ${getThemeColor(episode.theme)}, transparent)`
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        
                        <div className="relative z-10">
                          {isCurrentlyPlaying ? (
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Enhanced hover indicator line with glow */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                    style={{ 
                      backgroundColor: getThemeColor(episode.theme),
                      boxShadow: isHovered ? `0 0 10px ${getThemeColor(episode.theme)}` : 'none'
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
