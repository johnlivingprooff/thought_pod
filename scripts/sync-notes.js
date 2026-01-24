#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { syncNotesFromMarkdown } from '../src/lib/noteSync.js';

async function main() {
  console.log('Starting notes sync...');
  await syncNotesFromMarkdown();
  console.log('Notes sync completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});