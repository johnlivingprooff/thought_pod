import fs from 'fs';
import path from 'path';

const NOTES_DIR = path.join(process.cwd(), 'public/episode-notes-md');

// Read episode notes from the Markdown files
export async function getEpisodeNotes(episodeSlug: string): Promise<string | null> {
  try {
    const directPath = path.join(NOTES_DIR, `${episodeSlug}.md`);
    if (fs.existsSync(directPath)) {
      return fs.readFileSync(directPath, 'utf-8');
    }

    // Fallback: search for a file that matches the slug (e.g. "4" -> "4.md")
    if (fs.existsSync(NOTES_DIR)) {
      const files = fs.readdirSync(NOTES_DIR);
      const matchedFile = files.find(f => f.replace('.md', '') === episodeSlug);
      if (matchedFile) {
        return fs.readFileSync(path.join(NOTES_DIR, matchedFile), 'utf-8');
      }
    }

    return null;
  } catch (error) {
    console.error(`Error reading note for slug ${episodeSlug}:`, error);
    return null;
  }
}

// Get all available episode notes
export async function getAllEpisodeNotes(): Promise<Record<string, string>> {
  const notes: Record<string, string> = {};
  
  try {
    if (fs.existsSync(NOTES_DIR)) {
      const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const slug = file.replace('.md', '');
        notes[slug] = fs.readFileSync(path.join(NOTES_DIR, file), 'utf-8');
      }
    }
  } catch (error) {
    console.error('Error reading all notes:', error);
  }

  return notes;
}

export async function getEpisodeNoteSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(NOTES_DIR)) {
      return [];
    }

    return fs
      .readdirSync(NOTES_DIR)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch (error) {
    console.error('Error reading note slugs:', error);
    return [];
  }
}
