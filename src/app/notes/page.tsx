import { Suspense } from 'react';
import { getPublishedNotes, getNotesByEpisode, getEpisodes } from '@/lib/db';
import { Note, Episode, RawNote } from '@/types';
import Starfield from '@/components/Starfield';
import NotesList from '@/components/notes/NotesList';
import AddNoteForm from '@/components/notes/AddNoteForm';
import AddNoteToggle from '@/components/notes/AddNoteToggle';
import EpisodeFilter from '@/components/notes/EpisodeFilter';
import LatestNotes from '@/components/notes/LatestNotes';

async function getNotes(episodeId?: string): Promise<Note[]> {
  let rawNotes: RawNote[];
  if (episodeId) {
    rawNotes = getNotesByEpisode.all(episodeId) as RawNote[];
  } else {
    rawNotes = getPublishedNotes.all() as RawNote[];
  }

  // Convert is_official from integer (0/1) to boolean
  return rawNotes.map(note => ({
    ...note,
    is_official: Boolean(note.is_official)
  })) as Note[];
}

async function getEpisodesList(): Promise<Episode[]> {
  return getEpisodes.all() as Episode[];
}

async function getLatestNotes(): Promise<{ editorial: Note | null; community: Note | null }> {
  const rawNotes: RawNote[] = getPublishedNotes.all() as RawNote[];

  // Convert is_official from integer (0/1) to boolean
  const allNotes = rawNotes.map(note => ({
    ...note,
    is_official: Boolean(note.is_official)
  })) as Note[];

  const editorial = allNotes.find(note => note.author_type === 'admin') || null;
  const community = allNotes.find(note => note.author_type === 'community') || null;

  return { editorial, community };
}

interface NotesPageProps {
  searchParams: Promise<{ episode?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const [notes, episodes, latestNotes] = await Promise.all([
    getNotes(params.episode),
    getEpisodesList(),
    getLatestNotes()
  ]);

  return (
    <div className="min-h-screen relative">
      <Starfield themeColor={undefined} />
      <div className="relative z-10">
        {/* Hero Context */}
        <div className="pt-24 pb-16 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Community Notes
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              A quiet room where people think together. Reflections, insights, and conversations inspired by our podcast.
            </p>
          </div>
        </div>

        {/* Latest Notes Section */}
        <div className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <LatestNotes editorial={latestNotes.editorial} community={latestNotes.community} />
          </div>
        </div>

        {/* Add a Note Section - only show if no notes exist */}
        {notes.length === 0 && (
          <div className="pb-16 px-6">
            <div className="max-w-4xl mx-auto">
              <AddNoteForm episodes={episodes} />
            </div>
          </div>
        )}

        {/* Notes Feed */}
        <div className="pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            {params.episode && (
              <div className="mb-8">
                <EpisodeFilter episodes={episodes} currentEpisode={params.episode} />
              </div>
            )}

            <Suspense fallback={<div className="text-white/50 text-center py-12">Loading notes...</div>}>
              <NotesList notes={notes} episodes={episodes} />
            </Suspense>

            {/* Add Note Button - only show if notes exist */}
            {notes.length > 0 && (
              <div className="mt-12 text-center">
                <AddNoteToggle episodes={episodes} />
              </div>
            )}
          </div>
        </div>

        {/* Footer Context */}
        <div className="pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/40 text-sm mb-2">
              Notes are moderated with care. Community contributions appear after review.
            </p>
            <a
              href="/notes/community-guidelines"
              className="text-white/60 hover:text-white/80 text-sm underline transition-colors"
            >
              Community Guidelines
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}