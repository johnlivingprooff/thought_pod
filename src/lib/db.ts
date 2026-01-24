import { Pool, QueryResult } from 'pg';

// Initialize PostgreSQL connection for Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Create tables if they don't exist
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // First, check for any conflicting objects named 'notes'
    console.log('Checking for conflicting objects...');

    // More aggressive cleanup - drop everything that might conflict
    try {
      await pool.query('DROP TABLE IF EXISTS note_replies CASCADE');
      await pool.query('DROP TABLE IF EXISTS notes CASCADE');
      await pool.query('DROP TABLE IF EXISTS episodes CASCADE');
      await pool.query('DROP TYPE IF EXISTS notes CASCADE');
      await pool.query('DROP DOMAIN IF EXISTS notes CASCADE');
      await pool.query('DROP VIEW IF EXISTS notes CASCADE');
      console.log('Cleaned up any existing conflicting objects');
    } catch {
      console.log('Cleanup completed (some objects may not have existed)');
    }

    // Now create fresh tables
    console.log('Creating tables...');

    // Create tables with error handling for concurrent creation
    const createTable = async (name: string, sql: string) => {
      try {
        await pool.query(sql);
        console.log(`${name} table created successfully`);
      } catch (error) {
        const pgError = error as { code?: string };
        if (pgError.code === '42P07') { // relation already exists
          console.log(`${name} table already exists, skipping`);
        } else {
          throw error;
        }
      }
    };

    await createTable('notes', `
      CREATE TABLE notes (
        id TEXT PRIMARY KEY,
        title TEXT,
        episode_id TEXT,
        author_name TEXT,
        author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
        content TEXT NOT NULL,
        status TEXT CHECK(status IN ('published','pending','flagged')) NOT NULL,
        is_official BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await createTable('note_replies', `
      CREATE TABLE note_replies (
        id TEXT PRIMARY KEY,
        note_id TEXT NOT NULL,
        author_name TEXT,
        author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
      )
    `);

    await createTable('episodes', `
      CREATE TABLE episodes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw here - let the app continue without crashing
  }
}

// Check if tables exist and create them if they don't
async function ensureTablesExist() {
  try {
    console.log('Checking database tables...');

    // Check if notes table exists
    const notesExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'notes'
      )
    `);

    if (!notesExists.rows[0].exists) {
      console.log('Creating notes table...');
      await pool.query(`
        CREATE TABLE notes (
          id TEXT PRIMARY KEY,
          title TEXT,
          episode_id TEXT,
          author_name TEXT,
          author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
          content TEXT NOT NULL,
          status TEXT CHECK(status IN ('published','pending','flagged')) NOT NULL,
          is_official BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Check if note_replies table exists
    const repliesExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'note_replies'
      )
    `);

    if (!repliesExists.rows[0].exists) {
      console.log('Creating note_replies table...');
      await pool.query(`
        CREATE TABLE note_replies (
          id TEXT PRIMARY KEY,
          note_id TEXT NOT NULL,
          author_name TEXT,
          author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
        )
      `);
    }

    // Check if episodes table exists
    const episodesExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'episodes'
      )
    `);

    if (!episodesExists.rows[0].exists) {
      console.log('Creating episodes table...');
      await pool.query(`
        CREATE TABLE episodes (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          published_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    console.log('Database tables verified/created successfully');
  } catch (error) {
    console.error('Error ensuring tables exist:', error);
    // Don't throw here - let the app continue
  }
}

// Initialize database on module load (only in runtime, not during build)
async function initializeApp() {
  const connected = await testConnection();
  if (connected) {
    // In production, just ensure tables exist
    if (process.env.NODE_ENV === 'production') {
      await ensureTablesExist();
    } else if (process.env.SKIP_DB_INIT !== 'true') {
      // In development, do full initialization
      await initializeDatabase();
    }
  }
}

// Only initialize if not in build environment
if (typeof window === 'undefined' && !process.env.NEXT_PHASE) {
  initializeApp();
}

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
    `INSERT INTO notes (id, title, episode_id, author_name, author_type, content, status, is_official)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       episode_id = EXCLUDED.episode_id,
       author_name = EXCLUDED.author_name,
       author_type = EXCLUDED.author_type,
       content = EXCLUDED.content,
       status = EXCLUDED.status,
       is_official = EXCLUDED.is_official`,
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
    'INSERT INTO episodes (id, title, slug, published_at) VALUES ($1, $2, $3, $4) ON CONFLICT(id) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, published_at = EXCLUDED.published_at',
    [id, title, slug, published_at]
  );
};

export default pool;