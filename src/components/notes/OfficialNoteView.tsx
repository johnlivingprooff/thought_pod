'use client';

import { useState, useEffect } from 'react';
import { Note, Episode, NoteReply } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import AddReplyForm from './AddReplyForm';

interface OfficialNoteViewProps {
  note: Note;
  replies: NoteReply[];
  episodes: Episode[];
}

export default function OfficialNoteView({ note, replies: initialReplies, episodes }: OfficialNoteViewProps) {
  const [replies, setReplies] = useState<NoteReply[]>(initialReplies);

  useEffect(() => {
    // Fetch replies on client side
    const fetchReplies = async () => {
      try {
        const response = await fetch(`/api/notes/${note.id}/replies`);
        if (response.ok) {
          const fetchedReplies = await response.json();
          setReplies(fetchedReplies);
        }
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    fetchReplies();
  }, [note.id]);

  const getEpisodeTitle = (episodeId: string) => {
    return episodes.find(ep => ep.id === episodeId)?.title || episodeId;
  };

  const handleReplyAdded = (newReply: NoteReply) => {
    setReplies(prev => [...prev, newReply]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/50 rounded-full mb-4">
          <span className="text-amber-300 font-medium">Show Notes</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {note.title || 'Official Note'}
        </h1>
        <div className="flex items-center justify-center gap-4 text-white/70">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              note.author_type === 'admin' ? 'bg-blue-400' : 'bg-green-400'
            }`} />
            <span className="text-sm">
              {note.author_name || 'Anonymous'} • {note.author_type === 'admin' ? 'Editorial' : 'Community'}
            </span>
          </div>
          <span className="text-sm">•</span>
          <span className="text-sm">
            {new Date(note.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          {note.episode_id && (
            <>
              <span className="text-sm">•</span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {getEpisodeTitle(note.episode_id)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !String(children).includes('\n');
                return !isInline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-black/50 px-2 py-1 rounded-lg text-sm" {...props}>
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-amber-400 pl-4 italic text-white/90 my-4">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 my-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 my-4">
                  {children}
                </ol>
              ),
              p: ({ children }) => (
                <p className="text-white/90 leading-relaxed mb-4 last:mb-0">
                  {children}
                </p>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-white mb-3 mt-5 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium text-white mb-2 mt-4 first:mt-0">
                  {children}
                </h3>
              ),
            }}
          >
            {note.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Replies Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">Community Discussion</h2>
          <span className="text-white/50 text-sm">({replies.length} replies)</span>
        </div>

        {/* Add Reply Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
          <AddReplyForm noteId={note.id} onReplyAdded={handleReplyAdded} />
        </div>

        {/* Replies List */}
        {replies.length > 0 ? (
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    reply.author_type === 'admin' ? 'bg-blue-400' : 'bg-green-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">
                        {reply.author_name || 'Anonymous'}
                      </span>
                      <span className="text-white/50 text-xs">
                        {reply.author_type === 'admin' ? 'Editorial' : 'Community'}
                      </span>
                      <span className="text-white/50 text-xs">•</span>
                      <span className="text-white/50 text-xs">
                        {new Date(reply.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
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
                          p: ({ children }) => (
                            <p className="text-white/90 leading-relaxed mb-2 last:mb-0 text-sm">
                              {children}
                            </p>
                          ),
                        }}
                      >
                        {reply.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/50 italic">No replies yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}