'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Episode } from '@/types';
import { addNote } from '@/app/notes/actions';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AddNoteFormProps {
  episodes: Episode[];
  onSuccess?: () => void;
}

export default function AddNoteForm({ episodes, onSuccess }: AddNoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>('');
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    // Add the selected episode to the form data
    if (selectedEpisodeId) {
      formData.set('episode_id', selectedEpisodeId);
    }

    setIsSubmitting(true);
    try {
      await addNote(formData);
      router.refresh();
      setIsExpanded(false);
      setContent('');
      setIsPreview(false);
      setSelectedEpisodeId('');
      onSuccess?.(); // Call the success callback
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

    setContent(newText);

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertMarkdown('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('*', '*');
          break;
        case 'k':
          e.preventDefault();
          insertMarkdown('[', '](url)');
          break;
        case 'Enter':
          // Handle list continuation
          const textarea = e.target as HTMLTextAreaElement;
          const lines = content.split('\n');
          const currentLine = lines[textarea.value.substring(0, textarea.selectionStart).split('\n').length - 1];

          if (currentLine.match(/^\s*-\s/)) {
            e.preventDefault();
            insertMarkdown('\n- ', '');
          } else if (currentLine.match(/^\s*\d+\.\s/)) {
            const match = currentLine.match(/^\s*(\d+)\.\s/);
            if (match) {
              const nextNum = parseInt(match[1]) + 1;
              e.preventDefault();
              insertMarkdown(`\n${nextNum}. `, '');
            }
          }
          break;
      }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white/90">Add a Note</h2>
          <div className="text-xs text-white/40">supports markdown</div>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {/* Title input - only show when expanded */}
          {isExpanded && (
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-white/70">
                Title (optional)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Give your note a title..."
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
            </div>
          )}

          {/* Episode tagging - only show when expanded */}
          {isExpanded && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70">
                Tag Episode (optional)
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  type="button"
                  onClick={() => setSelectedEpisodeId('')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedEpisodeId === ''
                      ? 'bg-white/30 text-white border border-white/40'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  No episode tag
                </button>
                {episodes.map((episode) => (
                  <button
                    key={episode.id}
                    type="button"
                    onClick={() => setSelectedEpisodeId(episode.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      selectedEpisodeId === episode.id
                        ? 'bg-white/30 text-white border border-white/40'
                        : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                    }`}
                    title={episode.title}
                  >
                    {episode.title.length > 30 ? `${episode.title.substring(0, 30)}...` : episode.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name input - only show when expanded */}
          {isExpanded && (
            <div className="space-y-2">
              <label htmlFor="author_name" className="block text-sm font-medium text-white/70">
                Display Name
              </label>
              <input
                type="text"
                id="author_name"
                name="author_name"
                placeholder="Your name or handle"
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
            </div>
          )}

          {/* Editor Interface */}
          <div className="space-y-3">
            {/* Toolbar - always visible when expanded */}
            {isExpanded && (
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-md border border-white/10">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors font-bold"
                    title="Bold (Ctrl+B)"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors italic"
                    title="Italic (Ctrl+I)"
                  >
                    I
                  </button>
                  <div className="w-px h-6 bg-white/20 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('`', '`')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Code"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('[', '](url)')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Link (Ctrl+K)"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="w-px h-6 bg-white/20 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n- ', '')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Bullet List"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="4" cy="6" r="1.5" />
                      <path d="M7 4h9a1 1 0 010 2H7a1 1 0 110-2zM7 8h9a1 1 0 010 2H7a1 1 0 010-2zM7 12h9a1 1 0 010 2H7a1 1 0 010-2z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n1. ', '')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Numbered List"
                  >
                    <text x="2" y="6" fontSize="6" fill="currentColor" fontWeight="bold">1</text>
                    <text x="2" y="10" fontSize="6" fill="currentColor" fontWeight="bold">2</text>
                    <text x="2" y="14" fontSize="6" fill="currentColor" fontWeight="bold">3</text>
                    <path d="M7 4h9a1 1 0 010 2H7a1 1 0 110-2zM7 8h9a1 1 0 010 2H7a1 1 0 010-2zM7 12h9a1 1 0 010 2H7a1 1 0 010-2z" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n> ', '')}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Quote"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                      isPreview
                        ? 'bg-white/20 text-white border-white/30 shadow-sm'
                        : 'bg-white/5 text-white/70 border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
              </div>
            )}

            {/* Content input/preview */}
            {!isPreview ? (
              <textarea
                id="content"
                name="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={isExpanded ? 12 : 4}
                placeholder="Start writing..."
                onFocus={() => setIsExpanded(true)}
                className="w-full px-4 py-4 bg-black/20 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 resize-none transition-all duration-200 font-mono text-sm leading-relaxed"
              />
            ) : (
              <div
                className="min-h-[300px] px-4 py-4 bg-black/10 border border-white/10 rounded-md cursor-pointer hover:bg-black/20 transition-colors"
                onClick={() => setIsPreview(false)}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-black/50 px-1.5 py-0.5 rounded text-sm" {...props}>
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
                        <ul className="list-disc list-inside space-y-1 my-3">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 my-3">
                          {children}
                        </ol>
                      ),
                      p: ({ children }) => (
                        <p className="text-white/90 leading-relaxed mb-3 last:mb-0">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-lg font-semibold text-white mb-3 mt-4 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-semibold text-white mb-2 mt-3 first:mt-0">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold text-white mb-2 mt-2 first:mt-0">
                          {children}
                        </h3>
                      ),
                    }}
                  >
                    {content || '*Click to start writing...*'}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Hidden textarea for form submission */}
            <textarea
              name="content"
              value={content}
              readOnly
              className="hidden"
            />
          </div>

          {/* Controls - show when expanded */}
          {isExpanded && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setContent('');
                  setIsPreview(false);
                }}
                className="px-4 py-2 text-sm text-white/60 hover:text-white/80 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isSubmitting ? 'Adding Note...' : 'Add Note'}
              </button>
            </div>
          )}

          {/* Initial CTA when collapsed */}
          {!isExpanded && (
            <div className="text-center py-8">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                Click to start writing
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}