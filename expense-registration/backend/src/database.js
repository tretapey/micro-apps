const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/expenses.db');

// Ensure data directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log(`Creating data directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create a database connection
let db;
try {
  db = new Database(dbPath, { verbose: console.log });
  console.log(`Connected to the SQLite database at: ${dbPath}`);
} catch (err) {
  console.error('Error connecting to database:', err.message);
  process.exit(1);
}

// Initialize database with tables
const initializeDatabase = () => {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        monto REAL NOT NULL,
        categoria TEXT NOT NULL,
        fecha TEXT NOT NULL,
        forma_pago TEXT,
        aclaracion_pago TEXT,
        descripcion TEXT
      )
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error creating table:', err.message);
    process.exit(1);
  }
};

module.exports = {
  db,
  initializeDatabase
}; 