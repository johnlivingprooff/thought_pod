import Database from 'better-sqlite3';
import path from 'path';

// Initialize database
const dbPath = path.join(process.cwd(), 'notes.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT,
    episode_id TEXT,
    author_name TEXT,
    author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
    content TEXT NOT NULL,
    status TEXT CHECK(status IN ('published','pending','flagged')) NOT NULL,
    is_official BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS note_replies (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    author_name TEXT,
    author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS episodes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepared statements
export const insertNote = db.prepare(`
  INSERT INTO notes (id, title, episode_id, author_name, author_type, content, status, is_official)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

export const insertReply = db.prepare(`
  INSERT INTO note_replies (id, note_id, author_name, author_type, content)
  VALUES (?, ?, ?, ?, ?)
`);

export const getPublishedNotes = db.prepare(`
  SELECT * FROM notes
  WHERE status = 'published'
  ORDER BY created_at DESC
`);

export const getNoteReplies = db.prepare(`
  SELECT * FROM note_replies
  WHERE note_id = ?
  ORDER BY created_at ASC
`);

export const getNotesByEpisode = db.prepare(`
  SELECT * FROM notes
  WHERE status = 'published' AND episode_id = ?
  ORDER BY created_at DESC
`);

export const getAllNotes = db.prepare(`
  SELECT * FROM notes
  ORDER BY created_at DESC
`);

export const updateNoteStatus = db.prepare(`
  UPDATE notes SET status = ? WHERE id = ?
`);

export const getEpisodes = db.prepare(`
  SELECT * FROM episodes
  ORDER BY published_at DESC
`);

export const insertEpisode = db.prepare(`
  INSERT INTO episodes (id, title, slug, published_at)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(id) DO NOTHING
`);

export default db;