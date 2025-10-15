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

  const theme = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
  return (theme as Thought['theme']) || 'Capacity';
}

export async function parseRSSFeed(): Promise<Thought[]> {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(RSS_FEED_URL);

    const thoughts: Thought[] = feed.items.map((item, index) => ({
      id: item.guid || item.link || `episode-${index}`,
      title: item.title || 'Untitled Episode',
      description: item.contentSnippet || item.content || 'No description available',
      audio: item.enclosure?.url || '',
      pubDate: item.pubDate || new Date().toISOString(),
      theme: determineTheme(
        item.title || '',
        item.contentSnippet || item.content || ''
      )
    }));

    return thoughts;
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
