import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Starfield from '@/components/Starfield';

async function getCommunityGuidelines() {
  const filePath = path.join(process.cwd(), 'docs', 'community_guidelines.md');
  const content = await fs.readFile(filePath, 'utf8');
  return content;
}

export default async function CommunityGuidelinesPage() {
  const content = await getCommunityGuidelines();

  return (
    <div className="min-h-screen relative">
      <Starfield themeColor={undefined} />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <div className="prose prose-invert prose-lg max-w-none">
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
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-white mb-6 mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-white mb-4 mt-8 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium text-white mb-3 mt-6">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-white/90 leading-relaxed mb-4 last:mb-0">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 my-4 text-white/90">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 my-4 text-white/90">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-white/30 pl-6 italic text-white/80 my-6">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-white/90">
                      {children}
                    </em>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}