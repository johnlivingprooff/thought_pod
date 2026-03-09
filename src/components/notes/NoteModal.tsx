'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note, NoteReply } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import AddReplyForm from './AddReplyForm';

interface NoteModalProps {
  note: Note | null;
  replies: NoteReply[];
  isOpen: boolean;
  onClose: () => void;
  episodes: { id: string; title: string }[];
}

export default function NoteModal({ note, replies, isOpen, onClose, episodes }: NoteModalProps) {
  const [displayedReplies, setDisplayedReplies] = useState<NoteReply[]>(replies);

  useEffect(() => {
    setDisplayedReplies(replies);
  }, [replies, note?.id]);

  const getEpisodeTitle = (episodeId: string) => {
    return episodes.find(ep => ep.id === episodeId)?.title || episodeId;
  };

  const handleReplyAdded = (newReply: NoteReply) => {
    setDisplayedReplies((prev) => [...prev, newReply]);
  };

  if (!note) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl max-h-full overflow-hidden flex flex-col w-full max-w-4xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {note.title && (
                      <h2 className="text-xl font-semibold text-white mb-2">
                        {note.title}
                      </h2>
                    )}
                    <div className="flex items-center space-x-3 text-sm text-white/60">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          note.author_type === 'admin' ? 'bg-blue-400' : 'bg-green-400'
                        }`} />
                        <span>{note.author_name || 'Anonymous'}</span>
                      </div>
                      {note.episode_id && (
                        <>
                          <span>•</span>
                          <span>Episode: {getEpisodeTitle(note.episode_id)}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close note modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert prose-sm max-w-none mb-8">
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
                          <code className="bg-black/50 px-1 py-0.5 rounded-lg text-xs" {...props}>
                            {children}
                          </code>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-white/30 pl-4 italic text-white/80 my-4">
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 my-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 my-2">
                          {children}
                        </ol>
                      ),
                      p: ({ children }) => (
                        <p className="text-white/90 leading-relaxed mb-3 last:mb-0">
                          {children}
                        </p>
                      ),
                    }}
                  >
                    {note.content}
                  </ReactMarkdown>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Replies ({displayedReplies.length})
                  </h3>

                  {displayedReplies.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {displayedReplies.map((reply) => (
                        <div key={reply.id} className="bg-black/20 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${
                              reply.author_type === 'admin' ? 'bg-blue-400' : 'bg-green-400'
                            }`} />
                            <span className="text-sm font-medium text-white">
                              {reply.author_name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-white/50">
                              {new Date(reply.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-white/80 text-sm leading-relaxed">
                            {reply.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/50 text-sm mb-6">No replies yet. Start the conversation.</p>
                  )}

                  <AddReplyForm noteId={note.id} onReplyAdded={handleReplyAdded} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
