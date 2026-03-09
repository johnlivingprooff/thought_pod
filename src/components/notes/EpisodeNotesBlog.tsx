'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Episode, Thought } from '@/types';
import { useAudioStore } from '@/lib/audioStore';
import ThoughtPlayer from '@/components/ThoughtPlayer';

interface EpisodeNotesBlogProps {
  episode: Episode;
  content: string;
}

export default function EpisodeNotesBlog({ episode, content }: EpisodeNotesBlogProps) {
  const [allEpisodes, setAllEpisodes] = useState<Thought[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);
  const { currentEpisode, isPlaying, playEpisode, togglePlayPause } = useAudioStore();

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch('/api/episodes');
        if (!response.ok) {
          setAllEpisodes([]);
          return;
        }
        const data = await response.json();
        setAllEpisodes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch episodes for playback:', error);
        setAllEpisodes([]);
      } finally {
        setIsLoadingEpisodes(false);
      }
    };

    fetchEpisodes();
  }, []);

  const matchedEpisode = useMemo(
    () =>
      allEpisodes.find((thought) => {
        if (thought.id === episode.id || thought.slug === episode.slug) {
          return true;
        }

        return thought.title.trim().toLowerCase() === episode.title.trim().toLowerCase();
      }),
    [allEpisodes, episode.id, episode.slug, episode.title]
  );

  const activeThought = matchedEpisode && currentEpisode?.id === matchedEpisode.id;
  const canPlay = Boolean(matchedEpisode?.audio);

  const handlePlayClick = () => {
    if (!matchedEpisode) return;

    if (activeThought) {
      togglePlayPause();
      return;
    }

    playEpisode(matchedEpisode);
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {episode.title}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-4">
            Episode notes and reflections
          </p>
          <div className="text-white/60">
            Published {new Date(episode.published_at || episode.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/notes"
              className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
            >
              Back to all notes
            </Link>

            <button
              type="button"
              onClick={handlePlayClick}
              disabled={isLoadingEpisodes || !canPlay}
              className="px-5 py-2.5 rounded-full border border-white/30 bg-white/15 text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoadingEpisodes
                ? 'Loading audio...'
                : activeThought
                ? isPlaying
                  ? 'Pause episode'
                  : 'Resume episode'
                : 'Play episode'}
            </button>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="pb-16 px-6">
        <article className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-12">
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
                      <code className="bg-black/50 px-2 py-1 rounded-lg text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-amber-400 pl-6 italic text-white/90 my-6">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 my-6 text-white/90">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 my-6 text-white/90">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">
                      {children}
                    </li>
                  ),
                  p: ({ children }) => (
                    <p className="text-white/90 leading-relaxed mb-6 last:mb-0">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-white mb-6 mt-8 first:mt-0 border-b border-white/20 pb-3">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-white mb-4 mt-8 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium text-white mb-3 mt-6 first:mt-0">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-medium text-white mb-2 mt-5 first:mt-0">
                      {children}
                    </h4>
                  ),
                  hr: () => (
                    <hr className="border-white/20 my-8" />
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
        </article>
      </div>

      <ThoughtPlayer episodes={allEpisodes} />
    </div>
  );
}
