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
  const { isBookmarked } = useBookmarks();

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
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-green-500/20 text-green-400">Playing</span>
                      )}
                      {isBookmarked(episode.id) && (
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-yellow-400/20 text-yellow-400">Bookmarked</span>
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
                      {/* Notes Button */}
                      <Link
                        href={`/notes/episode/${episode.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                        aria-label="View episode notes"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.7769 10L16.6065 11.2941" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M11 12.8975L13.8978 13.6739" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M20.3116 12.6473C19.7074 14.9024 19.4052 16.0299 18.7203 16.7612C18.1795 17.3386 17.4796 17.7427 16.7092 17.9223C16.6129 17.9448 16.5152 17.9621 16.415 17.9744C15.4999 18.0873 14.3834 17.7881 12.3508 17.2435C10.0957 16.6392 8.96815 16.3371 8.23687 15.6522C7.65945 15.1114 7.25537 14.4115 7.07573 13.641C6.84821 12.6652 7.15033 11.5377 7.75458 9.28263L8.27222 7.35077C8.35912 7.02646 8.43977 6.72546 8.51621 6.44561C8.97128 4.77957 9.27709 3.86298 9.86351 3.23687C10.4043 2.65945 11.1042 2.25537 11.8747 2.07573C12.8504 1.84821 13.978 2.15033 16.2331 2.75458C18.4881 3.35883 19.6157 3.66095 20.347 4.34587C20.9244 4.88668 21.3285 5.58657 21.5081 6.35703C21.669 7.04708 21.565 7.81304 21.2766 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M3.27222 16.647C3.87647 18.9021 4.17859 20.0296 4.86351 20.7609C5.40432 21.3383 6.10421 21.7424 6.87466 21.922C7.85044 22.1495 8.97798 21.8474 11.2331 21.2432C13.4881 20.6389 14.6157 20.3368 15.347 19.6519C15.8399 19.1902 16.2065 18.6126 16.415 17.9741M8.51621 6.44531C8.16368 6.53646 7.77741 6.63996 7.35077 6.75428C5.09569 7.35853 3.96815 7.66065 3.23687 8.34557C2.65945 8.88638 2.25537 9.58627 2.07573 10.3567C1.91482 11.0468 2.01883 11.8129 2.30728 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>

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
