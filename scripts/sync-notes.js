#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { syncNotesFromMarkdown } from '../src/lib/noteSync.js';

async function main() {
  console.log('Starting notes sync...');
  try {
    await syncNotesFromMarkdown();
    console.log('Notes sync completed!');
  } catch (error) {
    console.error('Error during notes sync:', error);
    process.exit(1);
  }
  process.exit(0);
}

main();