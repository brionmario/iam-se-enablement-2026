#!/usr/bin/env node
import {
  seedDatabase,
  clearDatabase,
  reseedDatabase,
} from './database/seed.js';

/**
 * CLI tool for managing database seeding
 *
 * Usage:
 *   npm run seed        - Seed database if not already seeded
 *   npm run seed:force  - Force reseed (clear and seed)
 *   npm run db:clear    - Clear all database data
 */

const command = process.argv[2];

const runCommand = async () => {
  try {
    switch (command) {
      case 'seed':
        await seedDatabase(false);
        break;

      case 'seed:force':
      case 'reseed':
        await reseedDatabase();
        break;

      case 'clear':
        await clearDatabase();
        break;

      default:
        console.log('\n📦 Database Management CLI\n');
        console.log('Available commands:');
        console.log('  seed       - Seed database if not already seeded');
        console.log('  seed:force - Force reseed (clear and seed)');
        console.log('  clear      - Clear all database data');
        console.log('\nUsage:');
        console.log('  node src/seed-cli.js <command>');
        console.log('  npm run seed\n');
        process.exit(0);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

runCommand();
