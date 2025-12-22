import { Note } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface LatestNotesProps {
  editorial: Note | null;
  community: Note | null;
}

interface LatestNotesProps {
  editorial: Note | null;
  community: Note | null;
}

export default function LatestNotes({ editorial, community }: LatestNotesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Editorial Note */}
      <div className="relative">
        <div
          className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300"
          style={{ transform: 'rotate(1deg)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-blue-300 bg-blue-300/20 px-2 py-1 rounded-full">
              From the host
            </span>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>

          {editorial ? (
            <>
              <div className="mb-4 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md text-xs"
                          {...props}
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
                      <blockquote className="border-l-4 border-white/30 pl-4 italic text-white/80 my-2">
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 my-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 my-1">
                        {children}
                      </ol>
                    ),
                    p: ({ children }) => (
                      <p className="text-white/90 leading-relaxed mb-2 last:mb-0 line-clamp-4">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {editorial.content}
                </ReactMarkdown>
              </div>
              <div className="text-sm text-white/60">
                {new Date(editorial.created_at).toLocaleDateString()}
              </div>
            </>
          ) : (
            <div className="text-white/50 italic">
              No editorial notes yet...
            </div>
          )}
        </div>
      </div>

      {/* Community Note */}
      <div className="relative">
        <div
          className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300"
          style={{ transform: 'rotate(-1deg)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-green-300 bg-green-300/20 px-2 py-1 rounded-full">
              From the community
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>

          {community ? (
            <>
              <div className="mb-4 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md text-xs"
                          {...props}
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
                      <blockquote className="border-l-4 border-white/30 pl-4 italic text-white/80 my-2">
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 my-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 my-1">
                        {children}
                      </ol>
                    ),
                    p: ({ children }) => (
                      <p className="text-white/90 leading-relaxed mb-2 last:mb-0 line-clamp-4">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {community.content}
                </ReactMarkdown>
              </div>
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>{community.author_name || 'Anonymous'}</span>
                <span>{new Date(community.created_at).toLocaleDateString()}</span>
              </div>
            </>
          ) : (
            <div className="text-white/50 italic">
              Be the first to share your thoughts...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}