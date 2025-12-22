'use client';

import Link from 'next/link';
import { Episode } from '@/types';

interface EpisodeFilterProps {
  episodes: Episode[];
  currentEpisode?: string;
}

export default function EpisodeFilter({ episodes, currentEpisode }: EpisodeFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <Link
        href="/notes"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          !currentEpisode
            ? 'bg-white text-black shadow-lg'
            : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-md'
        }`}
      >
        All Notes
      </Link>

      {episodes.map((episode) => (
        <Link
          key={episode.id}
          href={`/notes?episode=${episode.id}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            currentEpisode === episode.id
              ? 'bg-white text-black shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-md'
          }`}
        >
          {episode.title}
        </Link>
      ))}
    </div>
  );
}