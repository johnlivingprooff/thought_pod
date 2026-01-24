import { getEpisodes } from '@/lib/db';
import { Episode } from '@/types';
import Starfield from '@/components/Starfield';
import EpisodeNotesIndex from '@/components/notes/EpisodeNotesIndex';

async function getEpisodesList(): Promise<Episode[]> {
  const result = await getEpisodes();
  return result.rows as Episode[];
}

export default async function NotesPage() {
  const episodes = await getEpisodesList();

  return (
    <div className="min-h-screen relative">
      <Starfield themeColor={undefined} />
      <div className="relative z-10">
        {/* Hero Context */}
        <div className="pt-24 pb-16 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Episode Notes
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Deep dives into each episode with reflections, insights, and key takeaways.
            </p>
          </div>
        </div>

        {/* Episode Notes Index */}
        <div className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <EpisodeNotesIndex episodes={episodes} />
          </div>
        </div>
      </div>
    </div>
  );
}