import { episodeNotes } from '../content/episodeNotesData';

// Read episode notes from the imported data
export async function getEpisodeNotes(episodeSlug: string): Promise<string | null> {
  return episodeNotes[episodeSlug] || null;
}

// Get all available episode notes
export async function getAllEpisodeNotes(): Promise<Record<string, string>> {
  return episodeNotes;
}