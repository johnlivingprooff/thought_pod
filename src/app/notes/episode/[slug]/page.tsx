import { notFound } from 'next/navigation';
import { getEpisodes } from '@/lib/db';
import { Episode } from '@/types';
import Starfield from '@/components/Starfield';
import EpisodeNotesBlog from '@/components/notes/EpisodeNotesBlog';
import { getEpisodeNotes } from '@/lib/episodeNotes';

interface EpisodePageProps {
  params: Promise<{ slug: string }>;
}

async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const result = await getEpisodes();
  const episodes = result.rows as Episode[];
  return episodes.find(ep => ep.slug === slug) || null;
}

export default async function EpisodeNotesPage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  // Get episode notes from markdown files
  const notesContent = await getEpisodeNotes(slug);

  if (!notesContent) {
    notFound();
  }

  return (
    <div className="min-h-screen relative">
      <Starfield themeColor={undefined} />
      <EpisodeNotesBlog episode={episode} content={notesContent} />
    </div>
  );
}