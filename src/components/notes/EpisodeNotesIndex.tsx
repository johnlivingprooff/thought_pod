'use client';

import Link from 'next/link';
import { Episode } from '@/types';

interface EpisodeNotesIndexProps {
  episodes: Episode[];
}

export default function EpisodeNotesIndex({ episodes }: EpisodeNotesIndexProps) {
  // Filter episodes that have notes (we'll check this by trying to load them)
  // For now, show all episodes - the individual pages will handle missing notes

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {episodes
          .filter(episode => episode.slug) // Only show episodes with slugs
          .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
          .map((episode) => (
            <Link
              key={episode.id}
              href={`/notes/episode/${episode.slug}`}
              className="group block bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors line-clamp-2">
                  {episode.title}
                </h3>
                <p className="text-white/70 text-sm line-clamp-3">
                  Episode notes and reflections...
                </p>
                <div className="text-xs text-white/50">
                  {new Date(episode.published_at || episode.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </Link>
          ))}
      </div>

      {episodes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50">No episode notes available yet.</p>
        </div>
      )}
    </div>
  );
}