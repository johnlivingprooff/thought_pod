'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Note, Episode, NoteReply } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import NoteModal from './NoteModal';
import { truncateNoteContent } from '@/lib/noteUtils';

interface EpisodeNotesListProps {
  notes: Note[];
  bonusNotes: Note[];
  episodes: Episode[];
}

export default function EpisodeNotesList({ notes, bonusNotes, episodes }: EpisodeNotesListProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteReplies, setNoteReplies] = useState<NoteReply[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleNoteClick = async (note: Note) => {
    // Official notes open in a new page instead of modal
    if (note.is_official) {
      router.push(`/notes/official/${note.id}`);
      return;
    }

    // Regular notes open in modal
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

  // Group notes by episode and sort them (official notes first, then by date)
  const notesByEpisode = notes.reduce((acc, note) => {
    if (!note.episode_id) return acc;
    if (!acc[note.episode_id]) {
      acc[note.episode_id] = [];
    }
    acc[note.episode_id].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  // Sort notes within each episode: community notes first, then official notes, then by creation date (newest first)
  Object.keys(notesByEpisode).forEach(episodeId => {
    notesByEpisode[episodeId].sort((a, b) => {
      if (a.is_official && !b.is_official) return 1; // official notes go to bottom
      if (!a.is_official && b.is_official) return -1; // community notes go to top
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  });

  if (Object.keys(notesByEpisode).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/50 italic">No episode notes yet. Be the first to share your thoughts on an episode!</p>
      </div>
    );
  }

  return (
    <>
      {/* Bonus Notes Section */}
      {bonusNotes.length > 0 && (
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Bonus Notes</h2>
            <p className="text-white/60 text-sm">
              {bonusNotes.length} bonus note{bonusNotes.length !== 1 ? 's' : ''} • Additional insights and reflections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {bonusNotes.map((note, index) => {
              const rotation = ((note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20) - 10) * 0.1;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group ${
                    note.is_official ? 'ring-2 ring-blue-400/50' : ''
                  }`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                  onClick={() => handleNoteClick(note)}
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {note.title && (
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                          {note.title}
                        </h3>
                      )}
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span>{note.author_name || 'Anonymous'}</span>
                        {note.is_official && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                            Official
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Note Content */}
                  <div className="text-white/80 text-sm leading-relaxed">
                    <ReactMarkdown
                      components={{
                        code({ node, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return match ? (
                            <SyntaxHighlighter
                              language={match[1]}
                              PreTag="div"
                              className="rounded text-xs"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-black/30 px-1 py-0.5 rounded text-xs" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {truncateNoteContent(note.content)}
                    </ReactMarkdown>
                  </div>

                  {/* Read More Indicator */}
                  {truncateNoteContent(note.content).includes('...') && (
                    <div className="mt-2 text-white/50 text-xs">
                      Click to read more...
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {Object.entries(notesByEpisode).map(([episodeId, episodeNotes]) => {
        const episode = episodes.find(ep => ep.id === episodeId);
        if (!episode) return null;

        return (
          <div key={episodeId} className="mb-16">
            {/* Episode Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{episode.title}</h2>
              <p className="text-white/60 text-sm">
                {episodeNotes.length} note{episodeNotes.length !== 1 ? 's' : ''} • {new Date(episode.published_at || episode.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Notes Grid - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
              {episodeNotes.map((note, index) => {
                // Deterministic rotation based on note ID
                const rotation = ((note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20) - 10) * 0.1;

                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="relative"
                  >
                    <div
                      onClick={() => handleNoteClick(note)}
                      className={`backdrop-blur-md rounded-lg p-6 border shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:rotate-0 cursor-pointer flex flex-col ${
                        note.is_official
                          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400/50 shadow-amber-500/20'
                          : 'bg-white/10 border-white/20'
                      }`}
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
                              const isInline = !String(children).includes('\n');
                              const match = /language-(\w+)/.exec(className || '');
                              return !isInline && match ? (
                                <SyntaxHighlighter
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-md text-xs"
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-black/50 px-1 py-0.5 rounded-lg text-xs" {...props}>
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
                          {truncateNoteContent(note.content)}
                        </ReactMarkdown>
                        {note.is_official && (
                          <div className="mt-3 pt-2 border-t border-amber-400/20">
                            <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full">
                              <span className="text-xs font-medium text-amber-300">Show Notes</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

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