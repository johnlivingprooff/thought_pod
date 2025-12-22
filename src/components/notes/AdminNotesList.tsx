'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '@/types';

interface AdminNotesListProps {
  notes: Note[];
}

export default function AdminNotesList({ notes }: AdminNotesListProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  async function updateNoteStatus(noteId: string, status: Note['status']) {
    setUpdating(noteId);
    try {
      const response = await fetch('/notes/admin/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setUpdating(null);
    }
  }

  const pendingNotes = notes.filter(note => note.status === 'pending');
  const publishedNotes = notes.filter(note => note.status === 'published');
  const flaggedNotes = notes.filter(note => note.status === 'flagged');

  return (
    <div className="space-y-12">
      {/* Pending Notes */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-yellow-400 flex items-center gap-3">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          Pending Notes ({pendingNotes.length})
        </h2>
        {pendingNotes.length === 0 ? (
          <p className="text-white/50 italic text-center py-8">No pending notes</p>
        ) : (
          <div className="space-y-6">
            {pendingNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdateStatus={updateNoteStatus}
                updating={updating === note.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Published Notes */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-green-400 flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          Published Notes ({publishedNotes.length})
        </h2>
        <div className="space-y-6">
          {publishedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdateStatus={updateNoteStatus}
              updating={updating === note.id}
            />
          ))}
        </div>
      </div>

      {/* Flagged Notes */}
      {flaggedNotes.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-red-400 flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            Flagged Notes ({flaggedNotes.length})
          </h2>
          <div className="space-y-6">
            {flaggedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdateStatus={updateNoteStatus}
                updating={updating === note.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  onUpdateStatus: (noteId: string, status: Note['status']) => void;
  updating: boolean;
}

function NoteCard({ note, onUpdateStatus, updating }: NoteCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            note.author_type === 'admin' ? 'bg-blue-400' : 'bg-green-400'
          }`} />
          <div>
            <p className="font-medium text-white">
              {note.author_name || 'Anonymous'}
            </p>
            <p className="text-sm text-white/50">
              {note.author_type === 'admin' ? 'Editorial' : 'Community'}
            </p>
          </div>
        </div>
        <div className="text-sm text-white/50">
          {new Date(note.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>

      <div className="mb-4">
        <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
          {note.content}
        </div>
      </div>

      {note.episode_id && (
        <div className="mb-4 text-sm text-white/60 italic">
          Episode: {note.episode_id}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          note.status === 'published' ? 'bg-green-600/20 text-green-300' :
          note.status === 'pending' ? 'bg-yellow-600/20 text-yellow-300' :
          'bg-red-600/20 text-red-300'
        }`}>
          {note.status}
        </span>

        <div className="flex space-x-2">
          {note.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(note.id, 'published')}
                disabled={updating}
                className="px-3 py-1 bg-green-600/20 text-green-300 border border-green-600/30 rounded-md text-sm hover:bg-green-600/30 disabled:opacity-50 transition-colors"
              >
                {updating ? '...' : 'Publish'}
              </button>
              <button
                onClick={() => onUpdateStatus(note.id, 'flagged')}
                disabled={updating}
                className="px-3 py-1 bg-red-600/20 text-red-300 border border-red-600/30 rounded-md text-sm hover:bg-red-600/30 disabled:opacity-50 transition-colors"
              >
                {updating ? '...' : 'Flag'}
              </button>
            </>
          )}
          {note.status === 'published' && (
            <button
              onClick={() => onUpdateStatus(note.id, 'flagged')}
              disabled={updating}
              className="px-3 py-1 bg-red-600/20 text-red-300 border border-red-600/30 rounded-md text-sm hover:bg-red-600/30 disabled:opacity-50 transition-colors"
            >
              {updating ? '...' : 'Flag'}
            </button>
          )}
          {note.status === 'flagged' && (
            <button
              onClick={() => onUpdateStatus(note.id, 'published')}
              disabled={updating}
              className="px-3 py-1 bg-green-600/20 text-green-300 border border-green-600/30 rounded-md text-sm hover:bg-green-600/30 disabled:opacity-50 transition-colors"
            >
              {updating ? '...' : 'Unflag'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}