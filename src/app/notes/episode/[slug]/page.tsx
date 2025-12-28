import { notFound } from 'next/navigation';
import { getNotesByEpisode, getEpisodes } from '@/lib/db';
import { Note, Episode, RawNote } from '@/types';
import Starfield from '@/components/Starfield';
import NotesList from '@/components/notes/NotesList';
import AddNoteForm from '@/components/notes/AddNoteForm';
import OfficialNoteView from '@/components/notes/OfficialNoteView';
import { getEpisodeNotes } from '@/lib/episodeNotes';

interface EpisodePageProps {
  params: { slug: string };
}

async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const result = await getEpisodes();
  const episodes = result.rows as Episode[];
  return episodes.find(ep => ep.slug === slug) || null;
}

export default async function EpisodeNotesPage({ params }: EpisodePageProps) {
  const episode = await getEpisodeBySlug(params.slug);

  if (!episode) {
    notFound();
  }

  const notesResult = await getNotesByEpisode(episode.id);
  const episodesResult = await getEpisodes();
  const rawNotes: RawNote[] = notesResult.rows as RawNote[];
  const episodes = episodesResult.rows as Episode[];

  // Convert is_official from integer (0/1) to boolean
  const notes = rawNotes.map(note => ({
    ...note,
    is_official: Boolean(note.is_official)
  })) as Note[];

  // Get official episode notes from markdown files
  const officialNotesContent = await getEpisodeNotes(params.slug);

  // Create an official note object if content exists
  const officialNote: Note | null = officialNotesContent ? {
    id: `official-${params.slug}`,
    title: 'Show Notes',
    episode_id: episode.id,
    author_name: 'Thought Podcast',
    author_type: 'admin',
    content: officialNotesContent,
    status: 'published',
    is_official: true,
    created_at: episode.published_at || episode.created_at
  } : null;

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

        {/* Official Episode Notes */}
        {officialNote && (
          <div className="pb-16 px-6">
            <div className="max-w-4xl mx-auto">
              <OfficialNoteView note={officialNote} replies={[]} episodes={episodes} />
            </div>
          </div>
        )}

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