#!/usr/bin/env node

/**
 * Database setup script for Thought Pod
 * Run this script to initialize the database tables
 * Usage: npm run db:setup
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Setting up Thought Pod database...');

    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');

    // Create tables if they don't exist
    console.log('Creating tables...');

    // Notes table
    await client.query(`
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
      )
    `);
    console.log('✅ Notes table created');

    // Note replies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS note_replies (
        id TEXT PRIMARY KEY,
        note_id TEXT NOT NULL,
        author_name TEXT,
        author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Note replies table created');

    // Episodes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS episodes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Episodes table created');

    client.release();
    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();