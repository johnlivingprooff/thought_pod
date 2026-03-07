#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  console.log('Starting episode sync...');
  const { syncEpisodesToDatabase } = await import('../src/lib/rssParser.js');
  await syncEpisodesToDatabase();
  console.log('Episode sync completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
