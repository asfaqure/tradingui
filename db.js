import initSqlJs from 'sql.js';
import fs from 'fs/promises';

let SQL;
let db;

// Initialize database
const initializeDatabase = async () => {
  SQL = await initSqlJs();
  db = new SQL.Database();
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
};

// Export database functions
export const query = (sql, params = []) => {
  return db.exec(sql, params);
};

export const insert = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.run(params);
  return stmt.getAsObject();
};

// Initialize on load
initializeDatabase();
