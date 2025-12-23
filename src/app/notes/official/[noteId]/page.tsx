import { notFound } from 'next/navigation';
import { getAllNotes, getEpisodes } from '@/lib/db';
import { Note, Episode, NoteReply, RawNote } from '@/types';
import Starfield from '@/components/Starfield';
import Navigation from '@/components/Navigation';
import OfficialNoteView from '@/components/notes/OfficialNoteView';

interface OfficialNotePageProps {
  params: { noteId: string };
}

async function getNoteById(noteId: string): Promise<Note | null> {
  const result = await getAllNotes();
  const rawNotes: RawNote[] = result.rows as RawNote[];
  const notes = rawNotes.map(note => ({
    ...note,
    is_official: Boolean(note.is_official)
  })) as Note[];

  return notes.find(note => note.id === noteId) || null;
}

async function getEpisodesList(): Promise<Episode[]> {
  const result = await getEpisodes();
  return result.rows as Episode[];
}

export default async function OfficialNotePage({ params }: OfficialNotePageProps) {
  const note = await getNoteById(params.noteId);
  const episodes = await getEpisodesList();

  if (!note || !note.is_official) {
    notFound();
  }

  // For now, we'll fetch replies client-side in the component
  // In a production app, you'd want to fetch them server-side
  const replies: NoteReply[] = [];

  return (
    <div className="min-h-screen relative">
      <Starfield themeColor={undefined} />
      <Navigation />

      <div className="relative z-10 pt-24">
        <div className="max-w-4xl mx-auto px-6">
          <OfficialNoteView
            note={note}
            replies={replies}
            episodes={episodes}
          />
        </div>
      </div>
    </div>
  );
}