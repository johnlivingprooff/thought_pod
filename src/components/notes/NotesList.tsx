'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Note, Episode, NoteReply } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import NoteModal from './NoteModal';

interface NotesListProps {
  notes: Note[];
  episodes: Episode[];
}

export default function NotesList({ notes, episodes }: NotesListProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteReplies, setNoteReplies] = useState<NoteReply[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNoteClick = async (note: Note) => {
    setSelectedNote(note);
    try {
      const response = await fetch(`/api/notes/${note.id}/replies`);
      if (response.ok) {
        const replies = await response.json();
        setNoteReplies(replies);
      } else {
        setNoteReplies([]);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
      setNoteReplies([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    setNoteReplies([]);
  };

  const getEpisodeTitle = (episodeId: string) => {
    return episodes.find(ep => ep.id === episodeId)?.title || episodeId;
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/50 italic">No notes yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
        {notes.map((note, index) => {
          // Deterministic rotation based on note ID to avoid hydration mismatch
          const rotation = ((note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20) - 10) * 0.1; // -1 to 1 degrees
          
          // Create varying heights for Pinterest-style layout
          const heightVariations = ['row-span-1', 'row-span-2', 'row-span-3'];
          const heightClass = heightVariations[Math.abs(note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % heightVariations.length];

          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className={`relative ${heightClass}`}
            >
              <div
                onClick={() => handleNoteClick(note)}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:rotate-0 cursor-pointer h-full flex flex-col"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease-out, scale 0.3s ease-out'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      note.author_type === 'admin' ? 'bg-blue-400' : 'bg-green-400'
                    }`} />
                    <div>
                      <p className="font-medium text-white text-sm">
                        {note.author_name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-white/50">
                        {note.author_type === 'admin' ? 'Editorial' : 'Community'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-white/50">
                    {new Date(note.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {note.title && (
                  <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                )}

                <div className="prose prose-invert prose-xs max-w-none mb-3 flex-1">
                  <ReactMarkdown
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !String(children).includes('\n');
                        return !isInline && match ? (
                          <SyntaxHighlighter
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md text-xs"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-black/50 px-1 py-0.5 rounded text-xs" {...props}>
                            {children}
                          </code>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-white/30 pl-2 italic text-white/80 my-2 text-xs">
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 my-1 text-xs">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 my-1 text-xs">
                          {children}
                        </ol>
                      ),
                      p: ({ children }) => (
                        <p className="text-white/90 leading-relaxed mb-2 last:mb-0 text-xs line-clamp-3">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-sm font-semibold text-white mb-1 mt-2 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-sm font-semibold text-white mb-1 mt-2 first:mt-0">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold text-white mb-1 mt-2 first:mt-0">
                          {children}
                        </h3>
                      ),
                    }}
                  >
                    {note.content}
                  </ReactMarkdown>
                </div>

                {note.episode_id && (
                  <div className="pt-2 border-t border-white/10 mt-auto">
                    <span className="inline-block bg-white/20 text-white/80 text-xs px-2 py-1 rounded-full truncate max-w-full">
                      {getEpisodeTitle(note.episode_id)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <NoteModal
        note={selectedNote}
        replies={noteReplies}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        episodes={episodes}
      />
    </>
  );
}