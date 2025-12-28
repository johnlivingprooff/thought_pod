#!/usr/bin/env node

import { syncEpisodesToDatabase } from '../src/lib/rssParser.js';

async function main() {
  console.log('Starting episode sync...');
  await syncEpisodesToDatabase();
  console.log('Episode sync completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});