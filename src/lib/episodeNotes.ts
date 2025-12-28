import fs from 'fs';
import path from 'path';

// Direct mapping of episode slugs to markdown filenames
const slugToFilenameMap: Record<string, string> = {
  'episode-3': 'Episode 3.md',
  'episode-4': 'Episode 4.md',
  'episode-5': 'Episode 5.md',
  'episode-6': 'Episode 6.md',
  'episode-7': 'Episode 7.md',
  'episode-8': 'Episode 8.md',
  'episode-8-pursuit': 'Episode 8 - Pursuit.md'
};

// Read episode notes from markdown files
export async function getEpisodeNotes(episodeSlug: string): Promise<string | null> {
  try {
    const filename = slugToFilenameMap[episodeSlug];
    if (!filename) return null;

    const filePath = path.join(process.cwd(), 'src/components/notes/episode_notes', filename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading episode notes:', error);
    return null;
  }
}

// Get all available episode notes
export async function getAllEpisodeNotes(): Promise<Record<string, string>> {
  const notes: Record<string, string> = {};

  for (const [slug, filename] of Object.entries(slugToFilenameMap)) {
    const content = await getEpisodeNotes(slug);
    if (content) {
      notes[slug] = content;
    }
  }

  return notes;
}