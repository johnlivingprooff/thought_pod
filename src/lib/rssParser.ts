import Parser from 'rss-parser';
import { Thought } from '@/types';

const RSS_FEED_URL = 'https://anchor.fm/s/100da1de8/podcast/rss';

// Theme keywords to categorize episodes
const themeKeywords = {
  Capacity: ['capacity', 'growth', 'learning', 'skill', 'develop', 'expand', 'practice'],
  Connection: ['connection', 'relationship', 'community', 'together', 'bond', 'vulnerable'],
  Condition: ['condition', 'state', 'awareness', 'present', 'reality', 'acceptance'],
  Commission: ['commission', 'purpose', 'calling', 'mission', 'intentional', 'direction']
};

// Determine theme based on title and description
function determineTheme(title: string, description: string): Thought['theme'] {
  const text = `${title} ${description}`.toLowerCase();
  
  const scores = {
    Capacity: 0,
    Connection: 0,
    Condition: 0,
    Commission: 0
  };

  // Count keyword matches for each theme
  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scores[theme as Thought['theme']] += 1;
      }
    });
  });

  // Find theme with highest score
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    // Default to rotating through themes if no keywords match
    return ['Capacity', 'Connection', 'Condition', 'Commission'][
      Math.floor(Math.random() * 4)
    ] as Thought['theme'];
  }

  const theme = Object.entries(scores).find((entry) => entry[1] === maxScore)?.[0];
  return (theme as Thought['theme']) || 'Capacity';
}

export async function parseRSSFeed(): Promise<Thought[]> {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(RSS_FEED_URL);

    // Sort items by publication date (oldest first)
    const sortedItems = feed.items.sort((a, b) => new Date(a.pubDate || 0).getTime() - new Date(b.pubDate || 0).getTime());

    const thoughts: Thought[] = sortedItems.map((item, index) => ({
      id: item.guid || item.link || `episode-${index}`,
      title: item.title || 'Untitled Episode',
      description: item.contentSnippet || item.content || 'No description available',
      audio: item.enclosure?.url || '',
      pubDate: item.pubDate || new Date().toISOString(),
      slug: (index + 1).toString(),
      theme: determineTheme(
        item.title || '',
        item.contentSnippet || item.content || ''
      )
    }));

    // Return in reverse order (newest first) for display
    return thoughts.reverse();
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    // Return empty array on error - API route will handle this
    return [];
  }
}

export async function getThoughts(): Promise<Thought[]> {
  return await parseRSSFeed();
}

export async function getLatestThought(): Promise<Thought | null> {
  const thoughts = await parseRSSFeed();
  return thoughts[0] || null;
}

export async function getThoughtsByTheme(theme: Thought['theme']): Promise<Thought[]> {
  const thoughts = await parseRSSFeed();
  return thoughts.filter(thought => thought.theme === theme);
}

export async function getEpisodesFromRSS(): Promise<{ id: string; title: string; slug: string; published_at: string }[]> {
  try {
    console.log('Fetching episodes from RSS...');
    const thoughts = await parseRSSFeed();
    console.log(`Parsed ${thoughts.length} thoughts from RSS`);

    // Sort episodes by publication date (oldest first)
    const sortedThoughts = thoughts.sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());

    const episodes = sortedThoughts.map((thought, index) => ({
      id: thought.id,
      title: thought.title,
      slug: (index + 1).toString(), // Use sequential numbers as slugs
      published_at: thought.pubDate
    }));

    console.log('First few episodes:', episodes.slice(0, 3));
    return episodes;
  } catch (error) {
    console.error('Error fetching episodes from RSS:', error);
    return [];
  }
}

export async function syncEpisodesToDatabase(): Promise<{ synced: number; skipped: number; errors: number }> {
  try {
    console.log('Syncing episodes from RSS to database...');
    const { initializeDatabase } = await import('./db');
    await initializeDatabase(); // Ensure database is initialized
    const rssEpisodes = await getEpisodesFromRSS();
    const { insertEpisode, getEpisodes } = await import('./db');

    let synced = 0;
    let skipped = 0;
    let errors = 0;

    // Get existing episodes to avoid duplicates
    const existingResult = await getEpisodes();
    const existingIds = new Set((existingResult.rows as { id: string }[]).map(ep => ep.id));

    for (const episode of rssEpisodes) {
      try {
        if (existingIds.has(episode.id)) {
          console.log(`⏭️  Episode already exists: ${episode.title}`);
          skipped++;
          continue;
        }

        await insertEpisode(episode.id, episode.title, episode.slug, episode.published_at);
        console.log(`✅ Synced episode: ${episode.title} (${episode.slug})`);
        synced++;
      } catch (error) {
        console.error(`❌ Error syncing episode ${episode.title}:`, error);
        errors++;
      }
    }

    console.log(`Episode sync completed: ${synced} synced, ${skipped} skipped, ${errors} errors`);
    return { synced, skipped, errors };
  } catch (error) {
    console.error('Error syncing episodes to database:', error);
    throw error;
  }
}
