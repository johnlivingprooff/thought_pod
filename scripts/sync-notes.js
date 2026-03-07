#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  console.log('Starting notes sync...');
  try {
    const { syncNotesFromMarkdown } = await import('../src/lib/noteSync.js');
    await syncNotesFromMarkdown();
    console.log('Notes sync completed!');
  } catch (error) {
    console.error('Error during notes sync:', error);
    process.exit(1);
  }
  process.exit(0);
}

main();
