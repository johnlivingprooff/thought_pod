import { getAllNotes, getEpisodes } from '@/lib/db';
import { Note, Episode, RawNote } from '@/types';
import Starfield from '@/components/Starfield';
import Navigation from '@/components/Navigation';
import EpisodeNotesList from '@/components/notes/EpisodeNotesList';
import AddNoteForm from '@/components/notes/AddNoteForm';
import AddNoteToggle from '@/components/notes/AddNoteToggle';
import { checkAdminStatus } from '@/app/notes/actions';

// Force dynamic rendering since we need to check cookies for admin status
export const dynamic = 'force-dynamic';

export default async function EpisodeNotesPage() {
  const notesResult = await getAllNotes();
  const episodesResult = await getEpisodes();
  const rawNotes: RawNote[] = notesResult.rows as RawNote[];
  const episodes = episodesResult.rows as Episode[];
  const isAdmin = await checkAdminStatus();

  // Convert is_official from integer (0/1) to boolean
  const notes = rawNotes.map(note => ({
    ...note,
    is_official: Boolean(note.is_official)
  })) as Note[];

  // Filter notes that have episode associations and bonus notes
  const episodeNotes = notes.filter(note => note.episode_id);
  const bonusNotes = notes.filter(note => !note.episode_id && note.is_official);

  return (
    <div className="min-h-screen relative">
      <Starfield themeColor={undefined} />
      <Navigation />

      <div className="relative z-10 pt-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Episode Notes</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Community insights and reflections on each episode of Thought Pod
            </p>
          </div>

          {/* Admin Add Note Section */}
          {isAdmin && (
            <>
              {/* Show full form if no episode notes exist */}
              {episodeNotes.length === 0 && (
                <div className="mb-8 flex justify-center">
                  <AddNoteForm episodes={episodes} narrow={true} />
                </div>
              )}

              {/* Show toggle button if episode notes exist */}
              {episodeNotes.length > 0 && (
                <div className="mb-8 flex justify-center">
                  <AddNoteToggle episodes={episodes} narrow={true} />
                </div>
              )}
            </>
          )}

          {/* Episode Notes Grid */}
          <EpisodeNotesList notes={episodeNotes} bonusNotes={bonusNotes} episodes={episodes} />
        </div>
      </div>
    </div>
  );
}