import fs from 'fs';
import path from 'path';
import { insertNote } from './db';
import { getEpisodes } from './db';

export async function syncNotesFromMarkdown(): Promise<{ synced: number; skipped: number; errors: number }> {
  try {
    console.log('Syncing notes from Markdown files...');
    const notesDir = path.join(process.cwd(), 'public/episode-notes-md');

    if (!fs.existsSync(notesDir)) {
      console.log('Notes directory does not exist:', notesDir);
      return { synced: 0, skipped: 0, errors: 0 };
    }

    const files = fs.readdirSync(notesDir).filter(file => file.endsWith('.md')).sort();
    console.log(`Found ${files.length} Markdown files`);

    // Get episodes ordered by published_at ASC (oldest first)
    const episodesResult = await getEpisodes();
    const episodes = episodesResult.rows.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());

    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const file of files) {
      try {
        const filePath = path.join(notesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Parse title and slug from filename
        const fileNameWithoutExt = file.replace('.md', '');

        let episodeId: string | null = null;
        let noteTitle = fileNameWithoutExt;

        // Try to find the episode by slug/number
        // We check if the filename (e.g., "10") matches an episode slug
        const episode = episodes.find(ep => ep.slug === fileNameWithoutExt);

        if (episode) {
          episodeId = episode.id;
          console.log(`🔗 Found episode match for ${file}: ${episode.title}`);
        } else {
          // Bonus note or unknown episode
          noteTitle = `Official Note: ${fileNameWithoutExt}`;
          console.log(`📝 Syncing as standalone note: ${file}`);
        }

        // Generate consistent ID based on filename to ensure we update existing records
        // We use a prefix to identify these as official notes
        const id = `official-${fileNameWithoutExt.toLowerCase().replace(/\s+/g, '-')}`;

        // Insert or update note
        await insertNote(
          id,
          noteTitle,
          episodeId,
          episode ? 'Thought Pod' : 'Admin',
          'admin',
          content,
          'published',
          true // is_official
        );

        console.log(`✅ Synced note: ${noteTitle}${episode ? ` (linked to ${episode.title})` : ''}`);
        synced++;
      } catch (error) {
        console.error(`❌ Error syncing note from ${file}:`, error);
        errors++;
      }
    }

    console.log(`Note sync completed: ${synced} synced, ${skipped} skipped, ${errors} errors`);
    return { synced, skipped, errors };
  } catch (error) {
    console.error('Error syncing notes from Markdown:', error);
    throw error;
  }
}