import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'checking...'
    };

    // Test database connection and check if tables exist
    try {
      const client = await pool.connect();

      // Test basic connection
      await client.query('SELECT 1');

      // Check if required tables exist
      const tablesResult = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_name IN ('notes', 'note_replies', 'episodes')
        AND table_schema = 'public'
      `);

      const existingTables = tablesResult.rows.map(row => row.table_name);
      const requiredTables = ['notes', 'note_replies', 'episodes'];
      const missingTables = requiredTables.filter(table => !existingTables.includes(table));

      client.release();

      if (missingTables.length === 0) {
        health.database = 'connected - all tables exist';
      } else {
        health.database = `connected - missing tables: ${missingTables.join(', ')}`;
        health.status = 'warning';
      }
    } catch (dbError) {
      health.database = `error: ${(dbError as Error).message}`;
      health.status = 'error';
    }

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}