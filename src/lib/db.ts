import { Pool, QueryResult } from 'pg';

// Initialize PostgreSQL connection for Vercel
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create tables if they don't exist
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT,
        episode_id TEXT,
        author_name TEXT,
        author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
        content TEXT NOT NULL,
        status TEXT CHECK(status IN ('published','pending','flagged')) NOT NULL,
        is_official BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS note_replies (
        id TEXT PRIMARY KEY,
        note_id TEXT NOT NULL,
        author_name TEXT,
        author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS episodes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database on module load
initializeDatabase();

// Helper function to execute queries
async function executeQuery(query: string, params: unknown[] = []): Promise<QueryResult> {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
}

// Prepared statement equivalents using functions
export const insertNote = async (id: string, title: string | null, episode_id: string | null, author_name: string | null, author_type: string, content: string, status: string, is_official: boolean) => {
  return executeQuery(
    'INSERT INTO notes (id, title, episode_id, author_name, author_type, content, status, is_official) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [id, title, episode_id, author_name, author_type, content, status, is_official]
  );
};

export const insertReply = async (id: string, note_id: string, author_name: string | null, author_type: string, content: string) => {
  return executeQuery(
    'INSERT INTO note_replies (id, note_id, author_name, author_type, content) VALUES ($1, $2, $3, $4, $5)',
    [id, note_id, author_name, author_type, content]
  );
};

export const getPublishedNotes = async () => {
  return executeQuery('SELECT * FROM notes WHERE status = $1 ORDER BY created_at DESC', ['published']);
};

export const getNoteReplies = async (noteId: string) => {
  return executeQuery('SELECT * FROM note_replies WHERE note_id = $1 ORDER BY created_at ASC', [noteId]);
};

export const getNotesByEpisode = async (episodeId: string) => {
  return executeQuery('SELECT * FROM notes WHERE status = $1 AND episode_id = $2 ORDER BY created_at DESC', ['published', episodeId]);
};

export const getAllNotes = async () => {
  return executeQuery('SELECT * FROM notes ORDER BY created_at DESC');
};

export const updateNoteStatus = async (status: string, id: string) => {
  return executeQuery('UPDATE notes SET status = $1 WHERE id = $2', [status, id]);
};

export const getEpisodes = async () => {
  return executeQuery('SELECT * FROM episodes ORDER BY published_at DESC');
};

export const insertEpisode = async (id: string, title: string, slug: string, published_at: string) => {
  return executeQuery(
    'INSERT INTO episodes (id, title, slug, published_at) VALUES ($1, $2, $3, $4) ON CONFLICT(id) DO NOTHING',
    [id, title, slug, published_at]
  );
};

export default pool;