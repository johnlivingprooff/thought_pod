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

    // Test database connection
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      health.database = 'connected';
    } catch (dbError) {
      health.database = `error: ${(dbError as Error).message}`;
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