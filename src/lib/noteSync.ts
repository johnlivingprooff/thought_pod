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

        // Parse episode number from filename (e.g., "1.md" -> 1)
        const numberMatch = file.match(/^(\d+)\.md$/);
        if (!numberMatch) {
          console.log(`⚠️  Invalid filename format: ${file} (expected format: 1.md, 2.md, etc.)`);
          skipped++;
          continue;
        }

        const episodeIndex = parseInt(numberMatch[1], 10) - 1; // Convert to 0-based index
        const episode = episodes[episodeIndex];

        // Use filename without .md as title
        const title = file.replace('.md', '');
        const noteContent = content;

        let episodeId: string | null = null;
        let noteTitle = title;

        if (episode) {
          episodeId = episode.id;
        } else {
          // Bonus note without corresponding episode
          noteTitle = `Bonus: ${title}`;
          console.log(`📝 Creating bonus note: ${noteTitle}`);
        }

        // Generate ID
        const id = `note-${episodeId || 'bonus'}-${Date.now()}`;

        // Insert note
        await insertNote(
          id,
          noteTitle,
          episodeId,
          'Admin', // or null
          'admin',
          noteContent,
          'published',
          true // is_official
        );

        console.log(`✅ Synced note: ${noteTitle}${episode ? ` for episode ${episode.title}` : ' (bonus)'}`);
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