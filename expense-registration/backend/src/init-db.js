const { initializeDatabase } = require('./database');
const path = require('path');
const fs = require('fs');

console.log('Initializing database...');

// Ensure data directory exists
const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  console.log(`Creating data directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
initializeDatabase();

console.log('Database initialization complete. You can now start the server.'); 