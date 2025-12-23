import { notFound } from 'next/navigation';
import { getNotesByEpisode, getEpisodes } from '@/lib/db';
import { Note, Episode } from '@/types';
import Starfield from '@/components/Starfield';
import NotesList from '@/components/notes/NotesList';
import AddNoteForm from '@/components/notes/AddNoteForm';

interface EpisodePageProps {
  params: { slug: string };
}

async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const episodes = getEpisodes.all() as Episode[];
  return episodes.find(ep => ep.slug === slug) || null;
}

export default async function EpisodeNotesPage({ params }: EpisodePageProps) {
  const episode = await getEpisodeBySlug(params.slug);

  if (!episode) {
    notFound();
  }

  const notes = getNotesByEpisode.all(episode.id) as Note[];
  const episodes = getEpisodes.all() as Episode[];

  return (
    <div className="min-h-screen relative">
      <Starfield themeColor={undefined} />
      <div className="relative z-10">
        {/* Hero Context */}
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {episode.title}
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-4">
              Community notes and reflections on this episode.
            </p>
            <div className="text-white/60">
              Published {new Date(episode.published_at || episode.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Add a Note Section */}
        <div className="pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <AddNoteForm episodes={episodes} />
          </div>
        </div>

        {/* Notes Feed */}
        <div className="pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <NotesList notes={notes} episodes={episodes} />
          </div>
        </div>

        {/* Footer Context */}
        <div className="pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/40 text-sm">
              Notes are moderated with care. Community contributions appear after review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}